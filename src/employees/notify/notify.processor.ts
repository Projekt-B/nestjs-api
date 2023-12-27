import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { QueueNamesEnum } from '../../queues/queue.names.enum';

@Injectable()
@Processor('notify')
export class NotifyProcessor {
    constructor(private readonly mailer: MailerService) {}

    @Process(QueueNamesEnum.JOB_EMPLOYEE_CREATED)
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

    @Process(QueueNamesEnum.JOB_EMPLOYEE_UPDATED)
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

    @Process(QueueNamesEnum.JOB_EMPLOYEE_DELETED)
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

    // @todo: implement logging, retry mechanic, concurrency protection
    safeRun(work: Function) {
        try {
            work();
        } catch (e) {
            console.log(e);
        }
    }
}
