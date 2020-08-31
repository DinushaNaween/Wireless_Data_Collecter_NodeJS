const mysql = require('../config/db.config');
const sql = mysql.connection;

// Save on one data table
exports.save = (tableName, data, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, [data], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err.message);
      result(err, null);
      return;
    }

    if (debug) console.log('Saved data: ', { id: res.insertId, ...data });
    result(null, { id: res.insertId, ...data });
    return;
  })
}

// Get data from data table
exports.getAll = (tableName, result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err.message);
      result(err, null);
      return;
    }

    if (debug) console.log('Data: ', res);
    result(null, res);
    return;
  })
}