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

    let dataValidationArray = [];

    for (let i = 0; i < req.body.data.length; i++) {
      const data = req.body.data[i];
      let tempArray = [];

      tempArray.push(req.body.parentNodeId)
      tempArray.push(data.sensorId)
      tempArray.push(data.lowerValidLimit)
      tempArray.push(data.upperValidLimit)
      tempArray.push(data.lastmodifiedUser)
      tempArray.push(new Date())

      dataValidationArray.push(tempArray);
    }

    DataValidation.create(dataValidationArray, (err, data) => {
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