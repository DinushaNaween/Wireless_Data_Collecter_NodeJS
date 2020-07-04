const sql = require('../config/db.config');

const DataValidation = function (dataValidation) {
  this.parentNodeId = dataValidation.parentNodeId;
  this.sensorId = dataValidation.sensorId;
  this.sensorName = dataValidation.sensorName;
  this.lowerValidLimit = dataValidation.lowerValidLimit;
  this.upperValidLimit = dataValidation.upperValidLimit;
  this.lastmodifiedUser = dataValidation.lastmodifiedUser;
  this.lastModifiedDateTime = dataValidation.lastModifiedDateTime;
};

// Create new dataValidation for parentNode
DataValidation.create = (newDataValidations, result) => {
  console.log('model file')
  sql.query('INSERT INTO dataValidation(parentNodeId, sensorId, sensorName, lowerValidLimit, upperValidLimit, lastmodifiedUser, lastModifiedDateTime) VALUES ?', [newDataValidations], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    sql.query('SELECT * FROM dataValidation WHERE parentNodeId = ? AND dataValidationId >= ?', [newDataValidations[0][0], res.insertId], (err, dataValidations) => {
      if (err) {
        if (debug) console.log('Error: ', err);
        result(err, null);
        return;
      }

      if (debug) console.log('Created dataValidations: ', dataValidations);
      result(null, dataValidations);
      return;
    })
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