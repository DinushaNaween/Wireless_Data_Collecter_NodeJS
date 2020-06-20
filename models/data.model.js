const sql = require('../config/db.config');

// Save on one data table
exports.save = (tableName, data, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, [data], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    // if (debug) console.log('Saved data: ', { id: res.insertId, ...data });
    result(null, { id: res.insertId, ...data });
    return;
  })
}