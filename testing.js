const mysql = require('mysql');

const tableName = "table_3";
const columns = ["column1", "column2", "column3", "column4", "column5"];

let sqlQuery2 = "CREATE TABLE " + tableName +" (id INT NOT NULL AUTO_INCREMENT, column0 INT, " + columns.join(" INT,") + " INT, PRIMARY KEY(id))"

console.log(sqlQuery2);

const devConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'wdc',
    port: 3306,
}
const sql = mysql.createConnection(devConfig)
sql.connect()
sql.query(sqlQuery2 ,(err, res) => {
  if (err) console.log(err)
  console.log(res)
})