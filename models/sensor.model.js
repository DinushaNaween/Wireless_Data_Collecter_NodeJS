const { query } = require('../config/db.config');

const Sensor = function (sensor) {
  this.sensorName = sensor.sensorName;
  this.sensorDiscription = sensor.sensorDiscription;
  this.dataType = sensor.dataType;
  this.dataSize = sensor.dataSize;
  this.sensingRange = sensor.sensingRange;
  this.technology = sensor.technology;
  this.workingVoltage = sensor.workingVoltage;
  this.dimensions = sensor.workingVoltage;
  this.specialFact = sensor.specialFact;
  this.sensorImageURL = sensor.sensorImageURL;
  this.disabled = sensor.disabled;
  this.lastModifiedUser = sensor.lastModifiedUser;
  this.lastModifiedDateTime = sensor.lastModifiedDateTime;
};

// create and save new sensor
Sensor.create = (newSensor, result) => {
  query('INSERT INTO sensor SET ?', newSensor, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created sensor: ', { id: res.insertId, ...newSensor });
    result(null, { id: res.insertId, ...newSensor });
    return;
  });
};

// get all sensors from database
Sensor.getAll = (result) => {
  query('SELECT * FROM sensor', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Sensors: ', res);
    result(null, res);
    return;
  });
};

// get sensor by id
Sensor.findById = (sensorId, result) => {
  query('SELECT * FROM sensor WHERE sensorId =' + sensorId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found sensor: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a sensor
Sensor.updateById = (sensorId, sensor, result) => {
  query('UPDATE sensor SET sensorName = ?, sensorDiscription = ?, dataType = ?, dataSize = ?, sensingRange = ?, technology = ?, workingVoltage = ?, dimensions = ?, specialFact = ?, sensorImageURL = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE sensorId = ?', [sensor.sensorName, sensor.sensorDiscription, sensor.dataType, sensor.dataSize, sensor.sensingRange, sensor.technology, sensor.workingVoltage, sensor.dimensions, sensor.specialFact, sensor.sensorImageURL, sensor.disabled, sensor.lastModifiedUser, sensor.lastModifiedDateTime, sensorId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated sensor: ', { id: sensorId, ...sensor });
    result(null, { id: sensorId, ...sensor });
    return;
  });
};

// delete a sensor by id
Sensor.remove = (sensorId, result) => {
  query('DELETE FROM sensor WHERE sensorId = ?', sensorId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted sensor with id: ', sensorId);
    result(null, res);
    return;
  });
};

// delete all sensors
Sensor.removeAll = result => {
  query('DELETE FROM sensor', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s sensors.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a sensor
Sensor.disable = (sensorId, sensor, result) => {
  query('UPDATE sensor SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE sensorId = ?', [sensor.lastModifiedUser, sensor.lastModifiedDateTime, sensorId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled sensor: ', { id: sensorId });
    result(null, { id: sensorId });
    return;
  })
};

module.exports = Sensor;