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
            `project_b`.`employees` `e`
            JOIN `project_b`.`employees_status` `s` ON((`s`.`id` = `e`.`status_id`))
          )
          JOIN `project_b`.`employees2departments` `e2d` ON((`e2d`.`employee_id` = `e`.`id`))
        )
        JOIN `project_b`.`employees2job_titles` `e2t` ON(
          (
            (`e2t`.`employee_id` = `e`.`id`)
            AND (`e2t`.`active` = 1)
          )
        )
      )
      JOIN `project_b`.`job_departments` `d` ON((`d`.`id` = `e2d`.`department_id`))
    )
    JOIN `project_b`.`job_titles` `jt` ON((`jt`.`id` = `e2t`.`title_id`))
  )