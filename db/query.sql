-- viewing all departments --
SELECT department.id AS id, department.name AS departments FROM department;

-- to add a department --
INSERT INTO department(name)
VALUES('Legal');

-- viewing all roles --
SELECT role.id AS id, role.title AS title, salary, department.name AS department
FROM role
JOIN department ON role.department_id = department_id;

-- to add a role --
INSERT INTO role(title, salary, department_id)
VALUES('Lawyer', 160000, 7);

-- viewing all employees --
SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department, manager_id
FROM employee
LEFT JOIN role ON employee.role_id = role_id
LEFT JOIN department ON role.department_id = department.id;

-- to add an employee --
--!!doublecheckthis!!--
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Jack', 'Smith', 6, 8);

-- to update an employee --
UPDATE employee
SET role_id = ?
WHERE id = ?;

-- viewing all managers --
SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE employee.manager_id IS NULL;

-- to update an employee manager --
--!!doublecheckthis!!--
UPDATE employee
SET manager_id = 1
WHERE manager_id IS NULL AND role_id = 4;

-- viewing all employees by manager --
SELECT employee.id AS id, first_name, last_name, role.title AS title, salary, department.name AS name
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE employee.manager_id = 1;

-- viewing employees by department --
SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE department.id = 4;

-- to delete an employee --
--!!doublecheckthis!!--
DELETE FROM employee
WHERE id = 7;

-- to delete a department --
--!!doublecheckthis!!--
DELETE FROM department
WHERE id = 5;

-- to access the budget --
--!!doublecheckthis!!--
SELECT department.name AS name, SUM(salary) AS budget
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE department.id = 4;