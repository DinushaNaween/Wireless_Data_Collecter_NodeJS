const mysql = require('mysql');

const HOST = 'localhost';
const USER = 'root';
const PASSWORD = '1234';
const DB = 'wdc';

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB
});

connection.connect(error => {
  if(error) throw error;

  console.log('Successfully connected to the database \"wdc\".');
});

module.exports = connection;