import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
@Processor('notify')
export class NotifyProcessor {
    constructor(private readonly mailer: MailerService) {}

    @Process('employee:created')
    created(job: Job) {
        this.safeRun(() => {
            this.mailer.sendMail({
                to: job.data?.employee?.email,
                from: 'noreply@mydomain.com',
                subject: 'Your account details for ACME corp!',
                template: 'employee.created.html.hbs',
                context: {
                    company: 'ACME Company',
                    email: job.data?.employee?.email,
                    first_name: job.data?.employee?.first_name,
                    last_name: job.data?.employee?.last_name,
                    password: job.data?.password?.password,
                },
            });
        });
    }

    @Process('employee:updated')
    updated(job: Job) {
        this.mailer.sendMail({
            to: job.data?.employee?.email,
            from: 'noreply@mydomain.com',
            subject: 'Your account UPDATED',
            template: 'employee.updated.html.hbs',
            context: {
                company: 'ACME Company',
                email: job.data?.employee?.email,
                first_name: job.data?.employee?.first_name,
                last_name: job.data?.employee?.last_name,
            },
        });
    }

    @Process('employee:deleted')
    deleted(job: Job) {
        this.mailer.sendMail({
            to: job.data?.employee?.email,
            from: 'noreply@mydomain.com',
            subject: 'Your account DELETED',
            template: 'employee.deleted.html.hbs',
            context: {
                company: 'ACME Company',
                email: job.data?.employee?.email,
                first_name: job.data?.employee?.first_name,
                last_name: job.data?.employee?.last_name,
            },
        });
    }

    safeRun(work: Function) {
        try {
            work();
        } catch (e) {
            console.log(e);
        }
    }
}
