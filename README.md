# Employee Management API

## Table of Contents

- [Employee Management API](#employee-management-api)
    - [Introduction](#introduction)
        - [Installation](#installation)
            - [Via docker-compose](#via-docker-compose)
            - [Manual](#manual)
            - [Run and access the project](#run-and-access-the-project)
    - [Selected tooling](#selected-tooling)
        - [RDBMS - MySQL](#rdbms---mysql)
        - [ORM - Prisma](#orm---prisma)
        - [HTTPD - nginx](#httpd---nginx)
        - [Queue - Bull + Redis](#queue---bull--redis)
        - [Node.js](#nodejs)
        - [Hashing - Argon2](#hashing---argon2)
        - [Mailer - nodemailer + Mailtrap.io](#mailer---nodemailer--mailtrapio)
        - [Templating engine - Handlebars](#templating-engine---handlebars)
    - [Why did/didn't you...](#why-diddidnt-you)
        - [Use view instead of ORM to search for employees](#use-view-instead-of-orm-to-search-for-employees)
        - [Test everything?](#test-everything)
        - [Split Queue processor in a different process](#split-queue-processor-in-a-different-process)
        - [Remove notification queue from employee module, within filesystem](#remove-notification-queue-from-employee-module-within-filesystem)
    - [If this was production, what would you do](#if-this-was-production-what-would-you-do)
        - [GraphQL](#graphql)
        - [Implement authentication](#implement-authentication)
        - [Authentication + authorization microservice](#authentication--authorization-microservice)
        - [Queue](#queue)
        - [Database/model](#databasemodel)
        - [i18n](#i18n)
        - [Exception handling / logging / observability](#exception-handling--logging--observability)
        - [Deployment](#deployment)
        - [Running node](#running-node)

## Introduction

Original task: https://github.com/the-project-b/backend-coding-challenge

### Installation

#### Via docker-compose

#### Manual

#### Run and access the project



### Selected tooling

#### RDBMS - MySQL

MySQL v8.03

Reason: I had the Docker container set up and DB up and running

Using ORM, adhering to ANSI SQL we can make the DB interchangeable

#### ORM - Prisma 

Reason: adhered to the tool in use with Project B

#### HTTPD - nginx

Reason: there's always a load balancer or httpd in front of node.js, it's the best when dev environment implements the smaller scale production one

I'm knowledgeable about nginx and use it to handle CORS, terminate SSL, add rate limiting or scale HTTP layer horizontally.

#### Queue - Bull + Redis

Reason: you mentioned Bull in the task. Redis - it's the de-facto standard.

#### Node.js

Version: v20.10.0

I use NVM to manage Node versions, NVM instructed that v20.10.0 was current LTS one

#### Hashing - Argon2

I used Argon2 library to handle hashing. Hashing is used to create the hash out of user's emails, using it as unique key when inserting into DB.
This technique allows to skip checking if emails already in use because this check can be a false positive and is insufficient. Uniqueness must be enforced on DB level.
Thus, this project does not check whether email is taken, it inserts into the database and appropriate exception handler deals with user-friendly error message.

#### Mailer - nodemailer + Mailtrap.io

Reason: nodemailer is popular package for handling emails and Mailtrap.io is a good service for development related tasks with emails like checking if it arrives and how it's rendered on various devices.

#### Templating engine - Handlebars

Reason: Handlebars were used for simple email templating, due to the fact it's super-popular and I needed simple variable interpolation for this task.
I kept to what I know works.

### Why did/didn't you...

#### Use view instead of ORM to search for employees

I modelled employees in such a way that an employee can have multiple departments associated with their account.

Employee's job title association implements history, i.e. when employee's job title changes - a new record is being made in `employees2job_titles` with the last record being made `active = 1`

There's an SQL view being used to query for employee list, it's used in Employee controller's `findAll()` method. 

Why view? Because it's easier to avoid reading JOIN's being made via ORM. View appears as a read-only table to the userland code.
Drawback is that a bit of logic resides on the DB level, however database needs to be the single source of truth for **data**. Also, views tend to be quick.

#### Test everything?

Time plays the factor here. I'd prefer DDD for this project, having started with tests first and the code as implementation.

I've no other excuse, sorry :)

#### Split Queue processor in a different process

Time constraints again, I fiddle with it before comitting this project for review. I'd definitely do so for production app.

#### Remove notification queue from employee module, within filesystem

I didn't think about it properly while considering how to do the task in order to impress you, so I messed up there :)

### If this was production, what would you do

#### GraphQL

Expose GraphQL via Apollo and GraphiQL playground.

#### Implement authentication

I didn't implement authentication. Routes are not protected in any way. 

I'd implement HTTP authentication using 2FA, with auth endpoint returning classic OAuth2 token setup + microservice described below.

Reason: using signed JWT's scales well, requests don't need to involve network to speak to DB/NoSQL in order to verify user's account/permissions.

Employees module uses argon2 to hash auto-generated password, same mechanism would be used to verify it, i.e. `password.verify(db.hash)`

#### Authentication + authorization microservice

Instead of checking for authn/authz in the application logic, I'd create a microservice based on nginx's http [auth request module](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html).

HTTP Auth Request module is a middleware-like approach in which requests that match regexp pattern are sent to an endpoint, before they are being sent to **actual** endpoints that should produce meaningful results.

Auth request endpoint receives request minus the reques body and has full access to HTTP headers / querystring / path params. 
Upon success, endpoint is supposed to return HTTP 200 status. It can inject data into the request, meaning that entire user checking, parsing and data obtaining
can be performed in the microservice. Nest.js application endpoints would only receive authorized requests and have user info available via HTTP headers.

This decouples the logic and allows secret(s) or PKI/certs to be available **only** to authn/authz microservice instead of entire API/GraphQL.

Solution like this scales well and provides infrastructure maintainers to act upon a single service in case an "off switch" needs to be implemented quickly.

Potential problem: **single point of failure**. This problem can be approached the same way as one would scale any HTTP endpoint: by providing multiple servers that are capable of processing the request in case one (or more) are/is down.

#### Queue

Queue processor should be scaled and be standalone instead of being coupled with HTTP server, running in the same process.

Ideally, for complex tasks and processing needs I'd use [Temporal](https://temporal.io/) because it exposes workflow logic with repeatable steps in case of failure.

Queue I implemented isn't durable and there's no concurrency protection. If multiple machines are being queue processors, the same job can be processed multiple times.

Jobs completion is not tied to database in any way so there's no way to find out whether user was emailed. The processor implementation is naive and simple for the purposes of doing the task quickly.

There's no UI or any means of reviewing queued or failed jobs, nor is there any sort of job management involved. In production system, this is unacceptable because every moving part must be made observable to platform maintainers.

#### Database/model

There's plenty of database choices, from managed services for MySQL / Postgres to scaling solutions like [Vitess](https://vitess.io/) to analytic solutions like [Clickhouse](https://clickhouse.com/)

I can't guess the scale but using mentioned tools, it's possible to scale the DB layer horizontally rather than vertically-only.

#### i18n

There's no i18n implementation, a real-life app requires it

#### Exception handling / logging / observability

There's only 1 custom exception handler which turns database unique constraint error message to something readable.

In production, turning all possible exceptions into human-friendly messages is required as well as logging them and exposing via service like [Sentry](https://sentry.io/welcome/) or similar.

#### Deployment

I'd opt for using Kubernetes due to ease of use and ability to scale this role to dedicated team. 

Logic would be as follows:
    - On push/merge to `deploy` branch, run **all** tests, if they pass - create container image, push to internal registry (available to Project B only, not a public registry)
    - DevOps get notified a new image is ready. This image is auto-tested therefore since it's on the registry, DevOps already assert it worked since it passed the tests
    - Deploy to `testing` environment, have QA run automated tests once more if they're applicable
    - If approved by unit and integration (e2e) test, QA and DevOps - production push is posssible

#### Running node

Depending on number of available CPU cores or CPUs themselves, each computer or Pod that runs Node would run Node.js in Cluster mode, with a supervisor such as [PM2](https://pm2.keymetrics.io/) to handle 