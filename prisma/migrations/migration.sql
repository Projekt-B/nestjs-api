-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status_id` INTEGER UNSIGNED NULL,
    `username` BINARY(64) NOT NULL,
    `auth_password` CHAR(128) NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `metadata` JSON NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `username`(`username`),
    INDEX `fk_status_id`(`status_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees2departments` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER UNSIGNED NOT NULL,
    `department_id` INTEGER UNSIGNED NOT NULL,
    `metadata` JSON NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `fk_department_id`(`department_id`),
    INDEX `fk_employee_id`(`employee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees2job_titles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `active` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `employee_id` INTEGER UNSIGNED NOT NULL,
    `title_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `fk_employee_to_status_id`(`title_id`),
    INDEX `fk_employee_to_title`(`employee_id`),
    UNIQUE INDEX `active`(`active`, `employee_id`, `title_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees_status` (
    `id` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_departments` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `member_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_titles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `fk_status_id` FOREIGN KEY (`status_id`) REFERENCES `employees_status`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees2departments` ADD CONSTRAINT `fk_department_id` FOREIGN KEY (`department_id`) REFERENCES `job_departments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees2departments` ADD CONSTRAINT `fk_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees2job_titles` ADD CONSTRAINT `fk_employee_to_status_id` FOREIGN KEY (`title_id`) REFERENCES `job_titles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees2job_titles` ADD CONSTRAINT `fk_employee_to_title` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

