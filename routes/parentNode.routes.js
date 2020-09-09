module.exports = app => {

  const parentNode = require('../controllers/parentNode.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Create new parentNode
  app.post('/parentNode', function (req, res, next) {
    reqLog(req, 'parentNode.create');
    next()
  },
    parentNode.create
  );

  // Get all parentNodes
  app.get('/parentNode', function (req, res, next) {
    reqLog(req, 'parentNode.getAll');
    next()
  },
    parentNode.getAll
  );

  // Find parentNode by id
  app.get('/parentNode/:parentNodeId', function (req, res, next) {
    reqLog(req, 'parentNode.findById');
    next()
  },
    parentNode.findById
  );

  // Update parentNode by id
  app.put('/parentNode/:parentNodeId', function (req, res, next) {
    reqLog(req, 'parentNode.update');
    next()
  },
    parentNode.update
  );

  // Delete parentNode by id
  app.delete('/parentNode/:parentNodeId', function (req, res, next) {
    reqLog(req, 'parentNode.remove');
    next()
  },
    parentNode.remove
  );

  // Delete all parentNodes
  app.delete('/parentNode', function (req, res, next) {
    reqLog(req, 'parentNode.removeAll');
    next()
  },
    parentNode.removeAll
  );

  // Disable a parentNode
  app.put('/parentNode/disable/:parentNodeId', function (req, res, next) {
    reqLog(req, 'parentNode.disable');
    next()
  },
    parentNode.disable
  );
}