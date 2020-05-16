const mysql = require('mysql');

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const DB = process.env.DB;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  port: PORT,
  database: DB
});

connection.connect(error => {
  if(error) throw error;

  console.log('Successfully connected to the database \"wdc\"');
});

module.exports = connection;