const db = require('./config/connection');
const inquirer = require('inquirer');

const questionPrompts = () => {
    inquirer.prompt(
        [
            {
                type: "list",
                name: "options",
                message: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department",
                    "Exit"
                ]
            }
        ]
    )
        .then(answer => {
            switch (answer.options) {
                case "View All Employees":
                    viewingEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee":
                    updateRole();
                    break;
                case "View Roles":
                    viewEveryRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Departments":
                    viewEveryDepartment();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                default:
                    db.end();
            }
        })
        .catch(err => {
            console.error(err);
        })
};

questionPrompts();

const viewEveryDepartment = () => {
    console.log("Listing All Departments...\n");
    const query = `SELECT department.id AS id, department.name AS departments FROM department`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);

        questionPrompts();
    })
};

const addDept = () => {
    console.log("Answer the following.");

    inquirer.prompt(
        [
            {
                type: "input",
                name: "name",
                message: "What name would you like to assign for Department? (Input)"
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

const viewEveryRole = () => {
    console.log("Listing roles...\n");
    const query = `SELECT role.id AS id, role.title AS title, salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`;

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);

        questionPrompts();
    })
};

const addRole = () => {
    db.query('SELECT * FROM department', (err, deptResult) => {
        if (err) throw err;

        const department = deptResult.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt(
            [
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the new role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the new role?"
                },
                {
                    type: "list",
                    name: "dept",
                    message: "In which department should we assign this role?",
                    choices: department
                }
            ]
        )
            .then(answer => {
                const query = `INSERT INTO role(title, salary, department_id
                VALUES(?, ?, ?)`;

                db.query(query, [answer.title, answer.salary, answer.dept], (err, result) => {
                    if (err) throw err;
                    console.log(`Department ${answer.name} successfully added with id ${result.insertId}`);

                    questionPrompts();
                })
            })
    })
};

const viewingEmployees = () => {
    console.log("Listing all employees...\n");
    const query = (`SELECT employee.id AS id, first_name, last_name, role.title AS title, department.name AS department, manager_id
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`);

    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);

        questionPrompts();
    })
};

const addEmployee = () => {
    db.query('SELECT * FROM employee', (err, employeeRes) => {
        if (err) throw err;

        const roles = employeeRes.map(({ id, title }) => ({ name: title, value: id }));

        let questions = [
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
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the associated manager of this employee?",
                choices: managers
            }
        ];
        inquirer.prompt(questions)
            .then(answer => {
                const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES(?, ?, ?, ?)`;

                db.query(query, [answer.first_name, answer.last_name, answer.role, answer.manager], (err, res) => {
                    if (err) throw err;
                    console.log(`Employee ${answer.first_name} ${answer.last_name} successfully added!`);

                    questionPrompts();
                })
            })
    })
};

const updateRole = () => {
    db.query('SELECT * FROM employee', (err, employeeRes) => {
        if (err) throw err;

        const employees = employeeRes.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));

        db.query('SELECT * FROM role', (err, roleRes) => {
            if (err) throw err;

            const roles = roleRes.map(({ title, id }) => ({ name: title, value: id }));

            let questions = [
                {
                    type: "list",
                    name: "employee",
                    message: "Which employee would you like to update?",
                    choices: employees
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is the employee's role?",
                    choices: roles
                }
            ];
            inquirer.prompt(questions)
                .then(answer => {
                    const query = `UPDATE employee SET role_id = ? Where id = ?`;

                    db.query(query, [answer.role, answer.employee], (err, result) => {
                        if (err) throw err;
                        console.log('Employee successfully updated!');

                        questionPrompts();
                    })
                })
        })
    })
};