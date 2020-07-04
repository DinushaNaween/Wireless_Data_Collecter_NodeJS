const sql = require('../config/db.config');

const ValidationAck = function (validationAck) {
  this.parentNodeId = validationAck.parentNodeId;
  this.nodeId = validationAck.nodeId;
  this.dataValidationId = validationAck.dataValidationId;
  this.sensorName = validationAck.sensorName;
  this.receivedValue = validationAck.receivedValue;
  this.lowerValidLimit = validationAck.lowerValidLimit;
  this.upperValidLimit = validationAck.upperValidLimit;
  this.status = validationAck.status;
  this.savedDateTime = validationAck.savedDateTime;
};

// Save new validationAck
ValidationAck.save = (newValidationAck, result) => {
  sql.query('INSERT INTO validationAck SET ?', newValidationAck, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Created validationAck: ', res);
    result(null, res);
    return;
  });
};

module.exports = ValidationAck;