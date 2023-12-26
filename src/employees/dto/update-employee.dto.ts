import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsStrongPassword,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';
import { EmployeeStatusValueObject } from '../vo/employee.status.vo';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsEnum(EmployeeStatusValueObject)
    status_id: number;

    @IsInt()
    @Min(1)
    @Max(1024)
    department_id: number;

    @IsInt()
    @Min(1)
    @Max(1024)
    title_id: number;

    @IsEmail()
    @MaxLength(255, {
        message: 'The email is too long, maximum value is 255 characters',
    })
    email: string;

    @MinLength(1)
    @MaxLength(255)
    first_name: string;

    @MinLength(1)
    @MaxLength(255)
    last_name: string;

    @IsOptional()
    @IsStrongPassword()
    password?: string;
}
