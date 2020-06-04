module.exports = app => {

  const sensor = require('../controllers/sensor.controller');
  const { reqLog } = require('../middlewares/logger');

  // Create new sensor
  app.post('/sensor', function (req, res, next) {
    reqLog(req, 'sensor.create');
    next()
  },
    sensor.create
  );

  // Get all sensors
  app.get('/sensor', function (req, res, next) {
    reqLog(req, 'sensor.getAll');
    next()
  },
    sensor.getAll
  );

  // Find sensor by id
  app.get('/sensor/:sensorId', function (req, res, next) {
    reqLog(req, 'sensor.findById');
    next()
  },
    sensor.findById
  );

  // Update sensor by id
  app.put('/sensor/:sensorId', function (req, res, next) {
    reqLog(req, 'sensor.update');
    next()
  },
    sensor.update
  );

  // Delete sensor by id
  app.delete('/sensor/:sensorId', function (req, res, next) {
    reqLog(req, 'sensor.remove');
    next()
  },
    sensor.remove
  );

  // Delete all sensors
  app.delete('/sensor', function (req, res, next) {
    reqLog(req, 'sensor.removeAll');
    next()
  },
    sensor.removeAll
  );

  // Disable a sensor
  app.put('/sensor/disable/:sensorId', function (req, res, next) {
    reqLog(req, 'sensor.disable');
    next()
  },
    sensor.disable
  );
}