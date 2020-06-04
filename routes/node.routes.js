module.exports = app => {

  const node = require('../controllers/node.controller');
  const { reqLog } = require('../middlewares/logger');

  // Create new node
  app.post('/node', function (req, res, next) {
    reqLog(req, 'node.create');
    next()
  },
    node.create
  );

  // Get all nodes
  app.get('/node', function (req, res, next) {
    reqLog(req, 'node.getAll');
    next()
  },
    node.getAll
  );

  // Find node by id
  app.get('/node/:nodeId', function (req, res, next) {
    reqLog(req, 'node.findById');
    next()
  },
    node.findById
  );

  // Update node by id
  app.put('/node/:nodeId', function (req, res, next) {
    reqLog(req, 'node.update');
    next()
  },
    node.update
  );

  // Delete node by id
  app.delete('/node/:nodeId', function (req, res, next) {
    reqLog(req, 'node.remove');
    next()
  },
    node.remove
  );

  // Delete all nodes
  app.delete('/node', function (req, res, next) {
    reqLog(req, 'node.removeAll');
    next()
  },
    node.removeAll
  );

  // Disable a node
  app.put('/node/disable/:nodeId', function (req, res, next) {
    reqLog(req, 'node.disable');
    next()
  },
    node.disable
  );
}