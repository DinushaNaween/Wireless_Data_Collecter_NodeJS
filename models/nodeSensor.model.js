const mysql = require('../config/db.config');
const sql = mysql.connection;

const NodeSensor = function (nodeSensor) {
  this.nodeId = nodeSensor.nodeId;
  this.sensorId = nodeSensor.sensorId;
  this.disabled = nodeSensor.disabled;
  this.lastModifiedUser = nodeSensor.lastModifiedUser;
  this.lastModifiedDateTime = nodeSensor.lastModifiedDateTime;
};

// Save new nodeSensor data
NodeSensor.createNodeSensor = (nodeId, columns, result) => {
  let columnsArray = [];
  let modifiedDateTime = new Date();

  for (let i = 0; i < columns.length; i++) {
    let tempArray = [];
    tempArray.push(nodeId);
    tempArray.push(columns[i].sensorId);
    tempArray.push(0);
    tempArray.push(null);
    tempArray.push(modifiedDateTime);

    columnsArray.push(tempArray);
  }

  sql.query('INSERT INTO nodeSensor(nodeId, sensorId, disabled, lastModifiedUser, lastModifiedDateTime) VALUES ?', [columnsArray], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    sql.query('SELECT * FROM nodeSensor WHERE nodeId = ? AND nodeSensorId >= ?', [nodeId, res.insertId], (err, newNodeSensors) => {
      if (err) {
        if (debug) console.log('Error: ', err);
        result(err, null);
        return;
      }
      
      if (debug) console.log('Created NodeSensors: ', err);
      result(null, res);
      return;
    });
  });
};

// Get node sensor data by nodeid
NodeSensor.getNodeSensorDataByNodeId = (nodeId, result) => {
  sql.query('SELECT * FROM nodeSensor WHERE nodeId = ?', [nodeId], (err, data) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found nodeSensor data: ', res);
      result(null, res);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// Remove node sensor data
NodeSensor.removeNodeSensor = (nodeId, columns, result) => {
  let deleteArray = [];

  for (let i = 0; i < columns.length; i++) {
    let tempArray = [];
    tempArray.push(nodeId);    
    tempArray.push(columns[i].sensorId);
    
    deleteArray.push(tempArray);
  }

  sql.query('DELETE FROM nodeSensor WHERE (nodeId, sensorId) IN (?)', [deleteArray], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('NodeSensor: ', err);
    result(null, res);
    return;
  });
};

module.exports = NodeSensor;