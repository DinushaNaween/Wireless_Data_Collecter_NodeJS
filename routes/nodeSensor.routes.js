module.exports = app => {

  const nodeSensor = require('../controllers/nodeSensor.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Create new node
  app.post('/nodeSensor', function (req, res, next) {
    reqLog(req, 'nodeSensor.create');
    next()
  },
    nodeSensor.createNodeSensor
  );
}