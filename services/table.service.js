const { query } = require('../config/db.config');

exports.getTableInfo = (tableName, result) => {
  query('SHOW COLUMNS FROM ' + tableName, (err, res) => {
    if (err) {
      if (debug) console.log('Error on getting columns of table: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Table info: ', res);
    result(null, res);
    return;
  })
}

exports.renameTable = (tableName, newTableName, result) => {
  query('ALTER TABLE ' + tableName + ' RENAME TO ' + newTableName, (err, res) => {
    if (err) {
      if (debug) console.log('Error on renaming table: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Table info: ', res);
    result(null, res);
    return;
  })
}