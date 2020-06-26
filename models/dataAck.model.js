const sql = require('../config/db.config');

const DataAck = function (dataAck) {
  this.parentNodeId = dataAck.parentNodeId;
  this.successNodes = dataAck.successNodes;
  this.errorNodes = dataAck.errorNodes;
  this.missedNodes = dataAck.missedNodes;
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

DataAck.getDataAcknowledgementById = (dataAckId, result) => {
  sql.query('SELECT * FROM dataAck WHERE dataAckId = ?', [dataAckId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found node: ', res[0]);
      result(null, res[0]);
      return;
    }
    
    result({ kind: 'not_found' }, null);
    return;
  })
}

module.exports = DataAck;