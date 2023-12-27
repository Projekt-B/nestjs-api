import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { AppModule } from '../app.module';
import { EmployeeInvalidDataStub } from './stubs/EmployeeInvalidData.stub';
import { EmployeeValidDataStub } from './stubs/EmployeeValidData.stub';
import { FindAllParamsEmpty } from './stubs/FindAllParamsEmpty.stub';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FindEmployeesDto } from './dto/find-employees.dto';

describe('EmployeesController', () => {
    let controller: EmployeesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        controller = module.get<EmployeesController>(EmployeesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('defines 5 methods to perform HTTP CRUD operations', () => {
        const expected = ['create', 'findAll', 'findOne', 'update', 'remove'];

        expected.forEach((methodName: string) => {
            expect(controller[methodName]).toBeDefined();
        });
    });

    describe('create() tests', () => {
        // @todo: expand validation to include all parameters with invalid combinations
        it('create(): fails the validation due to invalid input', async () => {
            const userInput = EmployeeInvalidDataStub();
            const invalidObject = plainToInstance(CreateEmployeeDto, userInput);
            const errors = await validate(invalidObject);

            expect(errors).toHaveProperty('length');
            expect(errors.length).toBeTruthy();
            expect(JSON.stringify(errors)).toContain(
                'status_id must be one of the following values',
            );
        });

        it('create(): passes input validation', async () => {
            const userInput = EmployeeValidDataStub();
            const validObject = plainToInstance(CreateEmployeeDto, userInput);
            const result = await validate(validObject);

            expect(result).toEqual([]);
        });
    });

    describe('findAll() tests', () => {
        it('findAll(): accepts any user-supplied input, returns default values for query', async () => {
            const userInput = FindAllParamsEmpty();
            const dto = plainToInstance(FindEmployeesDto, userInput);
            const result = await validate(dto);

            expect(result).toHaveProperty('length');
            expect(result.length).toEqual(0);
            expect(dto).toHaveProperty('skip');
            expect(dto).toHaveProperty('take');
            expect(dto).toHaveProperty('perPage');
            expect(dto.skip).toEqual(0);
            expect(dto.take).toEqual(10);
            expect(dto.take).toEqual(dto.perPage);
        });
    });
});
