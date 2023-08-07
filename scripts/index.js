// imports DOUBLE CHECK PATHS
const inquirer = require('inquirer');
const db = require('../config/connection');
const mysql = require('mysql2');
const { questionPrompts } = require('../index');

// viewing all departments
const viewEveryDepartment = () => {
    console.log('Listing all Departments:\n');
    const query = `SELECT department.id AS id, department.name AS departments FROM department`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);

        questionPrompts();
    })
};

// to add a department
const addDepartment = () => {
    inquirer.prompt(
        [
            {
                type: "input",
                name: "name",
                message: "Enter a name for the new Department..."
            }
        ]
    )
    .then(answer => {
        const query = `INSERT INTO department(name)
        VALUES(?)`;

        db.query(query, answer.name, (err, result) => {
            if (err) throw err;
            console.log(`Department ${answer.name} successfully added with id ${result.insertId}.`);

            questionPrompts();
        })
    })
};

// to delete a department
const deleteDepartment = () => {
    const deptQuery = `SELECT * FROM department`;

    db.query(deptQuery, (err, result) => {
        if (err) throw err;
        const departments = result.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "option",
                    message: "Which Department would you like to delete?",
                    choices: departments
                }
            ]
        )
    })
    .then(answer => {
        const query = `DELETE FROM department
        WHERE id = ?`;

        db.query(query, answer.option, (err, result) => {
            if (err) throw err;
            console.log(`${result.affectedRow} successfully deleted!`);

            questionPrompts();
        })
    })
};

// viewing all roles
const viewEveryRole = () => {
    console.log('Listing every role...\n');
    const query = `SELECT role.id AS id, role.title AS title, salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result); //check this out //

        questionPrompts();
    })
};

// to add a role
const addRole = () => {
    // display list of departments to add role to
    const deptQuery = `SELECT * FROM department`;

    db.query(deptQuery, (err, result) => {
        if (err) throw err;
        const departments = result.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the role you would like to add?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary for this role?"
                },
                {
                    type: "list",
                    name: "department",
                    message: "In which Department is this new role?",
                    choices: departments
                }
            ]
        )
    })
    .then(answer => {
        const query = `INSERT INTO role(title, salary, department_id)
        VALUES(?, ?, ?)`;

        db.query(query, answer.title, answer.salary, answer.department, (err, result) => {
            if (err) throw err;
            console.log(`Department ${answer.name} successfully added with id ${result.insertId}.`);

            questionPrompts();
        })
    })
};

// to delete a role
const deleteRole = () => {
    const roleQuery = `SELECT * FROM role`;

    db.query(roleQuery, (err, result) => {
        if (err) throw err;
        const roles = result.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "option",
                    message: "Which role would you like to delete?",
                    choices: roles
                }
            ]
        )
    })
    .then(answer => {
        const query = `DELETE FROM role
        WHERE id = ?`;

        db.query(query, answer.option, (err, result) => {
            if (err) throw err;
            console.log(`${result.affectedRow} successfully deleted!`);

            questionPrompts();
        })
    })
};

// viewing all employees
const viewingEmployees = () => {
    console.log('Listing every employee...\n');
    const query = `SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department, manager_id
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result); //DOUBLE CHECK

        questionPrompts();
    })
};

// viewing all managers
const viewingManagers = () => {
    console.log('Listing every manager...\n');
    const query = `SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE employee.manager_id IS NULL`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result) //DOUBLE CHECK

        questionPrompts();
    })
};

// viewing employees by manager
const viewingByManager = () => {
    const employeeQuery = `SELECT * FROM employee`;

    db.query(employeeQuery, (err, result) => {
        if (err) throw err;
        const employees = result.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id}));

        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "option",
                    message: "Whose employees would you like to view?",
                    choices: employees
                }
            ]
        )
    })
    .then(answer => {
        console.log('Listing all employees under selected manager...\n');
        const query = `SELECT employee.id AS id, first_name, last_name, role.title AS title, salary, department.name AS name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE employee.manager_id = ?`;

        db.query(query, answer.option, (err, result) => {
            if (err) throw err;
            console.log(result);

            questionPrompts();
        })
    })
};

// viewing employees by department
const viewingEmpsByDept = () => {
    const deptQuery = `SELECT * FROM department`;

    db.query(deptQuery, (err, result) => {
        if (err) throw err;
        const departments = result.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt(
            [
                {
                    type: "list",
                    name: "option",
                    message: "Which department would you like to search by?",
                    choices: departments
                }
            ]
        )
    })
    .then(answer => {
        console.log('Listing all employees under selected department...\n');
        const query = `SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE department.id = ?`;

        db.query(query, answer.option, (err, result) => {
            if (err) throw err;
            console.log(result);

            questionPrompts();
        })
    })
};

// adding employee
const addEmployee = () => {
    inquirer.prompt(
        [
            {
                type: "input",
                name: "first_name",
                message: "What is the first name of the employee?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the last name of the employee?"
            },
        ]
    )
    .then(answer => {
        const params = [answer.first_name, answer.last_name];
        const employeeQuery = `SELECT * FROM employee`;

        db.query(employeeQuery, (err, result) => {
            if (err) throw err;
            
            const managers = result.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id}));

            inquirer.prompt(
                [
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ]
            )
            .then(response => {
                const manager = response.managers;
                params.push(manager);

                const roleQuery = `SELECT * FROM role`;

                db.query(roleQuery, (err, result) => {
                    if (err) throw err;

                    const roles = result.map(({ title, id }) => ({ name: title, value: id }));

                    inquirer.prompt(
                        [
                            {
                                type: "list",
                                name: "role",
                                message: "What is the employee's role?",
                                choices: roles
                            }
                        ]
                    )
                    .then(data => {
                        const role = data.roles;
                        params.push(role);

                        const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                        VALUES(?, ?, ?, ?)`;

                        db.query(query, answer.first_name, answer.last_name, answer.role, answer.manager, (err, result) => {
                            if (err) throw err;
                            console.log(`Employee successfully added!`);

                            questionPrompts();
                        })
                    })
                })
            })
        })
    })
};

