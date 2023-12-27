# Employee Management API

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

#### Queue - Bull

Reason: you mentioned Bull in the task, I adhered to what was written

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

### Scaling

### If you could, what would you do differently

