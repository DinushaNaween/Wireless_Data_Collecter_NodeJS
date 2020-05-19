module.exports = app => {

  const sensor = require('../controllers/sensor.controller');

  // create new sensor
  app.post('/sensor', sensor.create);

  // get all sensors
  app.get('/sensor', sensor.getAll);

  // find sensor by id
  app.get('/sensor/:sensorId', sensor.findById);

  // update sensor by id
  app.put('/sensor/:sensorId', sensor.update);

  // delete sensor by id
  app.delete('/sensor/:sensorId', sensor.remove);

  // delete all sensors
  app.delete('/sensor', sensor.removeAll);

  // disable a sensor
  app.put('/sensor/disable/:sensorId', sensor.disable);
}