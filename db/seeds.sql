INSERT INTO department(name)
VALUES
    ('Human Resources'),
    ('Marketing'),
    ('Legal'),
    ('Engineering'),
    ('Sales');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Software Engineer', 85000, 4),
    ('Human Resources Specialist', 65000, 1),
    ('Salesperson', 75000, 5),
    ('Lawyer', 200000, 3),
    ('Accounts Manager', 70000, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Johnson', 2, NULL),
    ('Jeremy', 'Brevik', 1, 1),
    ('Mykel', 'Ralstin', 4, NULL),
    ('Lindsay', 'Alcombright', 1, 3),
    ('Christine', 'Haydel', 4, 3),
    ('Autumn', 'Black', 3, NULL),
    ('Garrett', 'Harmon', 3, 6),
    ('Drew', 'Tyler', 5, NULL),
    ('Michael', 'Myers', 5, 8);