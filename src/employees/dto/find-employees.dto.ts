import { IsInt, IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class FindEmployeesDto {
    @IsOptional()
    email?: string;

    @IsOptional()
    first_name?: string;

    @IsOptional()
    last_name?: string;

    @IsOptional()
    title_id?: number;

    @IsOptional()
    department_id?: number;

    @IsOptional()
    status_id?: number;

    @Expose()
    @IsOptional()
    page?: number;

    @Expose()
    @IsOptional()
    limit?: number;

    @IsOptional()
    cursor?: number;

    @Expose()
    get where(): Record<string, string | number | object> {
        const result = {};

        if (this.email) {
            result['email'] = {
                contains: this.email,
            };
        }

        if (this.first_name) {
            result['first_name'] = {
                contains: this.first_name,
            };
        }

        if (this.last_name) {
            result['last_name'] = {
                contains: this.last_name,
            };
        }

        if (this.title_id) {
            result['title_id'] = this.numberFromInput('title_id');
        }

        if (this.department_id) {
            result['department_id'] = this.numberFromInput('department_id');
        }

        if (this.status_id) {
            result['status_id'] = this.numberFromInput('status_id');
        }

        return result;
    }

    @Expose()
    get skip(): number {
        let page = Math.abs(this.numberFromInput('page'));

        return page <= 0 ? 0 : page;
    }

    @Expose()
    get take(): number {
        let limit = this.numberFromInput('limit');

        limit = Math.abs(limit);

        if (limit === 0) limit = 10;

        return limit;
    }

    @Expose()
    get currentPage(): number {
        return this.numberFromInput('page') + 1;
    }

    @Expose()
    get perPage(): number {
        return this.take;
    }

    private numberFromInput(key: string): number {
        let value = this[key] ?? 0;

        if (null === value || undefined === value) return 0;

        return parseInt(value, 10);
    }
}
