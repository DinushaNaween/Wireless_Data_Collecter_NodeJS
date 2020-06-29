const sql = require('../config/db.config');

const DataValidation = function (dataValidation) {
  this.parentNodeId = dataValidation.parentNodeId;
  this.sensorId = dataValidation.sensorId;
  this.lowerValidLimit = dataValidation.lowerValidLimit;
  this.upperValidLimit = dataValidation.upperValidLimit;
  this.lastmodifiedUser = dataValidation.lastmodifiedUser;
  this.lastModifiedDateTime = dataValidation.lastModifiedDateTime;
};

// Create new dataValidation for parentNode
DataValidation.create = (newDataValidation, result) => {
  console.log('model file')
  sql.query('INSERT INTO dataValidation SET ?', [newDataValidation], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Created dataValidation: ', { id: res.insertId, ...newDataValidation });
    result(null, { id: res.insertId, ...newDataValidation });
    return;
  });
};

// Data validation find by parent node id
DataValidation.getByParentNodeId = (parentNodeId, result) => {
  sql.query('SELECT * FROM dataValidation WHERE parentNodeId = ?', [parentNodeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
 
    if (res.length) {
      if (debug) console.log('Found validation: ', res);
      result(null, res);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  })
}

module.exports = DataValidation;