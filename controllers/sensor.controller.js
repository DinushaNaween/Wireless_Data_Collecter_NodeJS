const Sensor = require('../models/sensor.model');

// create and save new sensor
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const sensor = new Sensor({
    sensorName: req.body.sensorName,
    sensorDiscription: req.body.sensorDiscription,
    dataType: req.body.dataType,
    dataSize: req.body.dataSize,
    sensingRange: req.body.sensingRange,
    technology: req.body.technology,
    workingVoltage: req.body.workingVoltage,
    dimensions: req.body.dimensions,
    specialFact: req.body.specialFact,
    sensorImageURL: req.body.sensorImageURL,
    disabled: req.body.disabled, 
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  Sensor.create(sensor, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the sensor.'
      });
    } else res.send(data);
  });
};

// get all sensors from database
exports.getAll = (req, res) => {
  Sensor.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the sensors.'
      });
    } else res.send(data);
  });
};

// get sensor by id
exports.findById = (req, res) => {
  Sensor.findById(req.params.sensorId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving sensor with id ' + req.params.sensorId
        });
      }
    } else res.send(data);
  });
};

// update a sensor
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Sensor.updateById(req.params.sensorId, new Sensor(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        res.status(500).send({
          message: 'Error updating sensor with id ' + req.params.sensorId
        });
      }
    } else res.send(data);
  })
};

// delete a sensor by id
exports.remove = (req, res) => {
  Sensor.remove(req.params.sensorId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete sensor with id ' + req.params.sensorId
        });
      }
    } else res.send({ message: 'Sensor deleted successfully!' })
  });
};

// delete all sensors
exports.removeAll = (req, res) => {
  Sensor.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all sensors.'
      });
    } else res.send({ message: 'All sensors deleted successfully.' })
  })
};

// disable a sensor
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Sensor.disable(req.params.sensorId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        res.status(500).send({
          message: 'Error updating sensor with id ' + req.params.sensorId
        });
      }
    } else res.send({ message: 'Disabled sensor with id: ' + data.id +'.' });
  })
};