module.exports = app => {

  const collction = require('../controllers/collction.controller');
  const logger = require('../logger/logger');

  // Create new collction
  app.post('/collction', function (req, res, next) {
    logger.reqLog(req, 'collction.create');
    next()
  },
    collction.create
  );

  // Get all collctions
  app.get('/collction', function (req, res, next) {
    logger.reqLog(req, 'collction.getAll');
    next()
  },
    collction.getAll
  );

  // Find collction by id
  app.get('/collction/:collctionId', function (req, res, next) {
    logger.reqLog(req, 'collction.findById');
    next()
  },
    collction.findById
  );

  // Update collction by id
  app.put('/collction/:collctionId', function (req, res, next) {
    logger.reqLog(req, 'collction.update');
    next()
  },
    collction.update
  );

  // Delete collction by id
  app.delete('/collction/:collctionId', function (req, res, next) {
    logger.reqLog(req, 'collction.remove');
    next()
  },
    collction.remove
  );

  // Delete all collctions
  app.delete('/collction', function (req, res, next) {
    logger.reqLog(req, 'collction.removeAll');
    next()
  },
    collction.removeAll
  );

  // Disable a collction
  app.put('/collction/disable/:collctionId', function (req, res, next) {
    logger.reqLog(req, 'collction.disable');
    next()
  },
    collction.disable
  );
}