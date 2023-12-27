import { CreateEmployeeDto } from '../dto/create-employee.dto';

export const EmployeeValidDataStub = (): CreateEmployeeDto => {
    return {
        status_id: 1,
        department_id: 1,
        title_id: 1,
        email: 'lorem@ipsum.com',
        first_name: 'Dolor',
        last_name: 'Sit',
    };
};
