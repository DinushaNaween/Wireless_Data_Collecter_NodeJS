module.exports = app => {

  const privilege = require('../controllers/privilege.controller');
  const logger = require('../logger/logger');

  // Create new privilege
  app.post('/privilege', function (req, res, next) {
    logger.reqLog(req, 'privilege.create');
    next()
  },
    privilege.create
  );

  // Get all privileges
  app.get('/privilege', function (req, res, next) {
    logger.reqLog(req, 'privilege.getAll');
    next()
  },
    privilege.getAll
  );

  // Find privilege by id
  app.get('/privilege/:privilegeId', function (req, res, next) {
    logger.reqLog(req, 'privilege.findById');
    next()
  },
    privilege.findById
  );

  // Update privilege by id
  app.put('/privilege/:privilegeId', function (req, res, next) {
    logger.reqLog(req, 'privilege.update');
    next()
  },
    privilege.update
  );

  // Delete privilege by id
  app.delete('/privilege/:privilegeId', function (req, res, next) {
    logger.reqLog(req, 'privilege.remove');
    next()
  },
    privilege.remove
  );

  // Delete all privileges
  app.delete('/privilege', function (req, res, next) {
    logger.reqLog(req, 'privilege.removeAll');
    next()
  },
    privilege.removeAll
  );

  // Disable a privilege
  app.put('/privilege/disable/:privilegeId', function (req, res, next) {
    logger.reqLog(req, 'privilege.disable');
    next()
  },
    privilege.disable
  );
}