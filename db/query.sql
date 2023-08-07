-- viewing all departments --
SELECT department.id AS id, department.name AS departments FROM department;

-- viewing all roles --
SELECT role.id AS id, role.title AS title, salary, department.name AS department
FROM role
JOIN department ON role.department_id = department_id;

-- viewing all employees --
SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department, manager_id
FROM employee
LEFT JOIN role ON employee.role_id = role_id
LEFT JOIN department ON role.department_id = department.id;

-- viewing all managers --
SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
WHERE employee.manager_id IS NULL;

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