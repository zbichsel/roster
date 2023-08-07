// imprt MySQL and add .env
const mysql = require('mysql2');
require('dotenv').config();

// connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
);

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Connected to the roster_db database! 🚀`);
});

module.exports = db;