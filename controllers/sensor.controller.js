const Sensor = require('../models/sensor.model');
const logger = require('../middlewares/logger.middleware');
const fileUploadService = require('../services/fileUpload.service');

// create and save new sensor
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let sensor = new Sensor({
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
        logger.error('sensor.create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the sensor.'
        });
      } else {
        logger.info('sensor created');
        let fileName = `${data.id}_${data.sensorName}`;

        fileUploadService.uploadSensorImage(req, fileName, (imageUploadState, sensorImageURL) => {
          switch (imageUploadState) {
            case 'not_found':
              logger.info('sensor created without image');
              res.status(200).json({
                state: true,
                imageState: false,
                created_sensor: data
              });
              break;

            case 'error':
              logger.info('error while uploading image');
              res.status(200).json({
                state: true,
                imageState: false,
                created_sensor: data
              });
              break;
          
            case 'success':
              Sensor.updateSensorImageURL(sensorImageURL, data.id, (err, updatedData) => {
                if (err) {
                  logger.error('updateSensorImageURL', err.message);
                  res.status(200).json({
                    state: true,
                    imageState: false,
                    created_sensor: data
                  });
                } 

                if (updatedData) {
                  logger.info('sensor created with image');
                  data.sensorImageURL = sensorImageURL;
                  res.status(200).json({
                    state: true,
                    imageState: true,
                    created_sensor: data
                  });
                }
              });
              break;

            default:
              break;
          }
        });
      }
    });
  }
};

// get all sensors from database
exports.getAll = (req, res) => {
  Sensor.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the sensors.'
      });
    } else {
      logger.info('getAll success');
      res.status(200).json({
        state: true,
        sensors: data
      });
    }
  });
};

// get sensor by id
exports.findById = (req, res) => {
  Sensor.findById(req.params.sensorId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving sensor with id ' + req.params.sensorId
        });
      }
    } else {
      logger.info('findById success');
      res.status(200).json({
        state: true,
        sensor: data
      });
    }
  });
};

// update a sensor
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Sensor.updateById(req.params.sensorId, new Sensor(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found sensor with id ' + req.params.sensorId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating sensor with id ' + req.params.sensorId
          });
        }
      } else {
        let fileName = `${req.params.sensorId}_${req.body.sensorName}`;

        fileUploadService.uploadSensorImage(req, fileName, (imageUploadState, sensorImageURL) => {
          switch (imageUploadState) {
            case 'not_found':
              logger.info('sensor updated without image');
              res.status(200).json({
                state: true,
                imageState: false,
                updated_sensor: data
              });
              break;
            
            case 'error':
              logger.info('error while uploading image');
              res.status(200).json({
                state: true,
                imageState: false,
                updated_sensor: data
              });
              break;

            case 'success':
              Sensor.updateSensorImageURL(sensorImageURL, req.params.sensorId, (err, updatedData) => {
                if (err) {
                  logger.error('updateSensorImageURL', err.message);
                  res.status(200).json({
                    state: true,
                    imageState: false,
                    updated_sensor: data
                  });
                }

                if (updatedData) {
                  logger.info('sensor updated with image');
                  data.sensorImageURL = sensorImageURL;
                  res.status(200).json({
                    state: true,
                    imageState: true,
                    updated_sensor: data
                  });
                }
              });
              break;
          
            default:
              break;
          }
        });
      }
    });
  }
};

// delete a sensor by id
exports.remove = (req, res) => {
  Sensor.remove(req.params.sensorId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found sensor with id ' + req.params.sensorId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete sensor with id ' + req.params.sensorId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Sensor deleted successfully'
      });
    }
  });
};

// delete all sensors
exports.removeAll = (req, res) => {
  Sensor.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all sensors.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All sensors deleted successfully'
      });
    }
  })
};

// disable a sensor
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Sensor.disable(req.params.sensorId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found sensor with id ' + req.params.sensorId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating sensor with id ' + req.params.sensorId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled sensor with id: ' + data.id +'.'
        });
      }
    })
  }
};