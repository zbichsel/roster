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
            console.log(`Department ${answer.name} successfully added with id ${result.id}.`);

            questionPrompts();
        });
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
        });
    })
};

