const mysql = require('mysql');

const tableName = "testingObjectArray";
const columns = ["column1", "column2", "column3", "column4", "column5"];

const columnsWithTypes = [
  {
    column: "column1",
    type: "DECIMAL",
    size: "10"
  },
  {
    column: "column2",
    type: "DECIMAL",
    size: "10"
  },
  {
    column: "column3",
    type: "VARCHAR",
    size: "10"
  }
];

// console.log(columnsWithTypes.length);
// console.log(columnsWithTypes[0].column);

const columnsForNewTable = [];

for (let i = 0; i < columnsWithTypes.length; i++) {
  columnsForNewTable.push(columnsWithTypes[i].column + " " + columnsWithTypes[i].type + "(" + columnsWithTypes[i].size + ")");
}

// console.log(columnsForNewTable);

let sqlQuery2 = "CREATE TABLE " + tableName +" (id INT NOT NULL AUTO_INCREMENT, column0 INT, " + columnsForNewTable.join() + " , PRIMARY KEY(id))"

// console.log(sqlQuery2);

const devConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'wdc',
    port: 3306,
}
const sql = mysql.createConnection(devConfig)
sql.connect()
// sql.query(sqlQuery2 ,(err, res) => {
//   if (err) console.log(err)
//   console.log(res)
// })

sql.query('ALTER TABLE data ADD COLUMN data8 DECIMAL AFTER data1, ADD data9 DECIMAL AFTER data1, ADD data10 DECIMAL AFTER data1', (err, res) => {
  if (err) {
    console.log('Error: ', err);
  }

  console.log(res);

  // const columnsFromTable = [];

  // for (let i = 0; i < res.length; i++) {
  //   columnsFromTable.push(res[i].Field);
  // }

  // res.push(columnsFromTable);

  // console.log(res[res.length - 1]);

  // console.log(columnsFromTable);
})