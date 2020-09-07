const NodeSensor = require('../models/nodeSensor.model');
const logger = require('../middlewares/logger.middleware');

// Save new nodeSensor array
exports.createNodeSensor = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    NodeSensor.createNodeSensor(req.params.nodeId, req.body.columns, (err, data) => {
      if (err) {
        logger.error('createNodeSensor', err.message);
        res.status(500).json({
          state: false,
          message: 'Some error occured while creating nodeSensors'
        });
      } 

      if (data) {
        logger.info('createNodeSensor success');
        res.status(200).json({
          state: true,
          nodeSensors: data
        })
      }
    })
  }
}

// Get NodeSensor Data By NodeId
exports.getNodeSensorDataByNodeId = (req, res) => {
  NodeSensor.getNodeSensorDataByNodeId(req.params.nodeId, (err, data) => {
    if (err) {
      logger.error('getNodeSensorDataByNodeId', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the nodeSensors.'
      });
    } else {
      logger.info('getNodeSensorDataByNodeId success');
      res.status(200).json({
        state: true,
        nodes: data
      });
    }
  });
};