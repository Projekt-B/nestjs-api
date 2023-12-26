import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FindEmployeesDto } from './dto/find-employees.dto';

@Controller({
    path: '/api/v1/employees',
})
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Post()
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get()
    findAll(@Query() params: FindEmployeesDto) {
        return this.employeesService.findAll(params);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ) {
        return this.employeesService.update(+id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(+id);
    }
}
