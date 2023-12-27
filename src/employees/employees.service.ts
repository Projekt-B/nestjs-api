import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { without } from '../util.functions';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { FindEmployeesDto } from './dto/find-employees.dto';
import { QueueNamesEnum } from '../queues/queue.names.enum';

@Injectable()
export class EmployeesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly crypto: CryptoService,
        private readonly config: ConfigService,
        @InjectQueue('notify') private readonly queue: Queue,
    ) {}

    async create(createEmployeeDto: CreateEmployeeDto) {
        // Generate the password
        const password = await this.crypto.generatePassword();

        // Create database records
        const entity = await this.createEmployeeDatabaseRecord(
            createEmployeeDto,
            password,
        );

        // Notify the user, use queue to take care of email sending
        await this.enqueue(QueueNamesEnum.JOB_EMPLOYEE_CREATED, {
            createEmployeeDto,
            password,
        });

        return entity;
    }

    async findAll(params: FindEmployeesDto) {
        const { data, count } = await this.prisma.$transaction(async () => {
            const data = await this.prisma.view_employees.findMany({
                where: params.where,
                skip: params.skip,
                take: params.take,
            });

            const count = await this.prisma.view_employees.count({
                where: params.where,
            });

            return { data, count };
        });

        return {
            pagination: {
                total: count,
                perPage: params.perPage,
                currentPage: params.currentPage,
            },
            data: data,
        };
    }

    findOne(id: number) {
        return this.prisma.view_employees.findFirstOrThrow({
            where: { id: id },
        });
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        // Logic: control what to update by being explicit about parameters in the request
        const data = {};

        // Columns to update if provided in HTTP request
        [
            'status_id',
            'department_id',
            'title_id',
            'first_name',
            'last_name',
        ].forEach((key: string) => {
            if (this[key]) {
                data[key] = updateEmployeeDto[key];
            }
        });

        // New password? Hash, rename to correct column
        if (updateEmployeeDto.password) {
            data['auth_password'] = await this.crypto.hashPassword(
                updateEmployeeDto.password,
            );
        }

        const employee = await this.prisma.employees.update({
            where: {
                id: id,
            },
            data: data,
        });

        await this.enqueue(QueueNamesEnum.JOB_EMPLOYEE_UPDATED, {
            employee: without(employee, ['username', 'auth_password']),
        });

        return without(employee, ['username', 'auth_password']);
    }

    async remove(id: number) {
        const employee = await this.prisma.employees.delete({
            where: {
                id: id,
            },
        });

        // Notify about account deletion
        await this.enqueue(QueueNamesEnum.JOB_EMPLOYEE_DELETED, {
            employee: employee,
        });

        return without(employee, ['username', 'auth_password']);
    }

    private async createEmployeeDatabaseRecord(
        createEmployeeDto: CreateEmployeeDto,
        password: { password: string; hash: string },
    ): Promise<{ employee: {}; department: {}; job: {} }> {
        // Logic explanation: user's email is their username
        // Username must be unique. Goal: have fixed index length in the database, leverage
        // database mechanisms to enforce uniqueness.
        // Human explanation: hash the email, save the hash, hash is unique index (binary data type). This makes
        // index to have fixed length, we don't need to worry about unicode, odd characters, checking if username
        // is taken because we simply need to insert and let the DB tell us if user exists or not

        return this.prisma.$transaction(async () => {
            const employee = await this.prisma.employees.create({
                //@ts-ignore
                data: {
                    status_id: createEmployeeDto.status_id,
                    // @ts-ignore
                    auth_password: password.hash,
                    // @ts-ignore
                    username: this.crypto.sha256(createEmployeeDto.email),
                    first_name: createEmployeeDto.first_name,
                    last_name: createEmployeeDto.last_name,
                    email: createEmployeeDto.email,
                },
            });

            const employee2department =
                await this.prisma.employees2departments.create({
                    // @ts-ignore
                    data: {
                        employee_id: employee.id,
                        department_id: createEmployeeDto.department_id,
                    },
                });

            const employee2job_title =
                await this.prisma.employees2job_titles.create({
                    // @ts-ignore
                    data: {
                        active: 1,
                        employee_id: employee.id,
                        title_id: createEmployeeDto.title_id,
                    },
                });

            return {
                employee: without(employee, ['username', 'auth_password']), // binary and hash values, not needed for frontend
                department: employee2department,
                job: employee2job_title,
            };
        });
    }

    private async enqueue(name: string, params: object) {
        return await this.queue.add(
            name,
            params,
            this.config.get('notifyQueue'),
        );
    }
}
