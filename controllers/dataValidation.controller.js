const DataValidation = require('../models/dataValidation.model');
const logger = require('../middlewares/logger.middleware');

exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let dataValidation = new DataValidation({
      parentNodeId: req.body.parentNodeId,
      sensorId: req.body.sensorId,
      lowerValidLimit: req.body.lowerValidLimit,
      upperValidLimit: req.body.upperValidLimit,
      lastmodifiedUser: req.body.lastmodifiedUser,
      lastModifiedDateTime: new Date()
    });

    DataValidation.create(dataValidation, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the dataValidation.'
        });
      } else {
        logger.info('DataValidation created');
        res.status(200).json({
          state: true,
          created_dataValidation: data
        });
      }
    });
  }
};

exports.getByParentNodeId = (req, res) => {
  DataValidation.getByParentNodeId(req.params.parentNodeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('getByParentNodeId notFound');
        res.status(404).json({
          state: false,
          message: 'Not found dataValidation with parentNodeId: ' + req.params.parentNodeId
        });
      } else {
        logger.error('getByParentNodeId', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving dataValidation with parentNodeId: ' + req.params.parentNodeId
        });
      }
    } else {
      logger.info('getByParentNodeId success');
      res.status(200).json({
        state: true,
        dataValidation: data
      });
    }
  })
}