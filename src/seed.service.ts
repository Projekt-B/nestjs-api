import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedService {
    constructor(private readonly prisma: PrismaService) {}

    async seedData(): Promise<void> {
        try {
            await this.prisma.employees_status.createMany({
                data: this.provideEmployeeStatusData(),
            });

            await this.prisma.job_titles.createMany({
                data: this.provideJobTitleData(),
            });

            await this.prisma.job_departments.createMany({
                data: this.provideDepartmentData(),
            });
        } catch (error) {
            console.error('Database seeding failed:', error);
            throw error;
        }

        console.log('done!');
        return void 0;
    }

    provideEmployeeStatusData(): Array<{ id: number; title: string }> {
        return [
            {
                id: 1,
                title: 'Active',
            },
            {
                id: 10,
                title: 'Inactive',
            },
            {
                id: 20,
                title: 'Suspended',
            },
            {
                id: 30,
                title: 'Pending Verification',
            },
            {
                id: 40,
                title: 'Closed/Terminated',
            },
            {
                id: 50,
                title: 'Limited Access',
            },
            {
                id: 60,
                title: 'Needs Update',
            },
            {
                id: 70,
                title: 'On Hold',
            },
            {
                id: 80,
                title: 'Flagged/Under Review',
            },
            {
                id: 90,
                title: 'VIP/Pro/Premium',
            },
        ];
    }

    provideJobTitleData(): Array<{ title: string }> {
        return [
            {
                title: 'Senior Software Engineer',
            },
            {
                title: 'Marketing Manager',
            },
            {
                title: 'Customer Service Representative',
            },
            {
                title: 'Financial Analyst',
            },
            {
                title: 'Human Resources Coordinator',
            },
            {
                title: 'Operations Manager',
            },
            {
                title: 'Data Scientist',
            },
            {
                title: 'Sales Associate',
            },
            {
                title: 'Administrative Assistant',
            },
            {
                title: 'Graphic Designer',
            },
            {
                title: 'Product Manager',
            },
            {
                title: 'Quality Assurance Specialist',
            },
            {
                title: 'IT Support Technician',
            },
            {
                title: 'Content Writer',
            },
            {
                title: 'Business Development Executive',
            },
            {
                title: 'Research Analyst',
            },
            {
                title: 'Project Coordinator',
            },
            {
                title: 'Accountant',
            },
            {
                title: 'Operations Coordinator',
            },
            {
                title: 'Executive Assistant',
            },
        ];
    }

    provideDepartmentData(): Array<{ title: string }> {
        return [
            {
                title: 'Sales',
            },
            {
                title: 'Marketing',
            },
            {
                title: 'Human Resources',
            },
            {
                title: 'Finance',
            },
            {
                title: 'Customer Service',
            },
            {
                title: 'Information Technology',
            },
            {
                title: 'Operations',
            },
            {
                title: 'Research and Development',
            },
            {
                title: 'Administration',
            },
            {
                title: 'Product Development',
            },
            {
                title: 'Quality Assurance',
            },
            {
                title: 'Legal',
            },
            {
                title: 'Procurement',
            },
            {
                title: 'Public Relations',
            },
            {
                title: 'Facilities Management',
            },
            {
                title: 'Business Development',
            },
            {
                title: 'Risk Management',
            },
            {
                title: 'Supply Chain',
            },
            {
                title: 'Compliance',
            },
            {
                title: 'Data Analysis',
            },
            {
                title: 'Corporate Communications',
            },
            {
                title: 'Training and Development',
            },
            {
                title: 'Internal Audit',
            },
            {
                title: 'Employee Relations',
            },
            {
                title: 'Strategic Planning',
            },
            {
                title: 'Inventory Management',
            },
            {
                title: 'Advertising',
            },
            {
                title: 'Media Relations',
            },
            {
                title: 'Vendor Management',
            },
            {
                title: 'Regulatory Affairs',
            },
            {
                title: 'Health and Safety',
            },
            {
                title: 'Event Management',
            },
            {
                title: 'Corporate Social Responsibility',
            },
            {
                title: 'Talent Acquisition',
            },
            {
                title: 'Network Security',
            },
            {
                title: 'Software Development',
            },
            {
                title: 'Market Research',
            },
            {
                title: 'Budgeting and Forecasting',
            },
            {
                title: 'Performance Management',
            },
            {
                title: 'Diversity and Inclusion',
            },
            {
                title: 'Business Intelligence',
            },
            {
                title: 'Mergers and Acquisitions',
            },
            {
                title: 'International Business',
            },
            {
                title: 'E-commerce',
            },
            {
                title: 'Customer Experience',
            },
            {
                title: 'Brand Management',
            },
            {
                title: 'Logistics',
            },
            {
                title: 'Risk Assessment',
            },
            {
                title: 'Sustainability',
            },
        ];
    }
}
