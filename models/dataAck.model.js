const sql = require('../config/db.config');

const DataAck = function (dataAck) {
  this.parentNodeId = dataAck.parentNodeId;
  this.successNodes = dataAck.successNodes;
  this.errorNodes = dataAck.errorNodes;
  this.noOfMissedNodes = dataAck.noOfMissedNodes;
  this.noOfExtraNodes = dataAck.noOfExtraNodes;
  this.savedDateTime = dataAck.savedDateTime;
};

DataAck.saveAcknowledgement = (newDataAck, result) => {
  sql.query('INSERT INTO dataAck SET ?', newDataAck, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Saved data acknowledgement: ', { id: res.insertId, ...newDataAck });
    result(null, { id: res.insertId, ...newDataAck });
    return;
  });
}

module.exports = DataAck;