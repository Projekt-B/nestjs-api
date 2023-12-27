SELECT
  `e`.`id` AS `id`,
  `e`.`status_id` AS `status_id`,
  `e`.`first_name` AS `first_name`,
  `e`.`last_name` AS `last_name`,
  `e`.`email` AS `email`,
  `e`.`metadata` AS `metadata`,
  `e2d`.`metadata` AS `department_metadata`,
  `s`.`title` AS `status_title`,
  `d`.`title` AS `department_title`,
  `jt`.`title` AS `job_title`
FROM
  (
    (
      (
        (
          (
            `employees` `e`
            JOIN `employees_status` `s` ON((`s`.`id` = `e`.`status_id`))
          )
          JOIN `employees2departments` `e2d` ON((`e2d`.`employee_id` = `e`.`id`))
        )
        JOIN `employees2job_titles` `e2t` ON(
          (
            (`e2t`.`employee_id` = `e`.`id`)
            AND (`e2t`.`active` = 1)
          )
        )
      )
      JOIN `job_departments` `d` ON((`d`.`id` = `e2d`.`department_id`))
    )
    JOIN `job_titles` `jt` ON((`jt`.`id` = `e2t`.`title_id`))
  )