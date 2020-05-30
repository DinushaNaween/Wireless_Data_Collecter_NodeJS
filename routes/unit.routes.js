module.exports = app => {

  const unit = require('../controllers/unit.controller');
  const logger = require('../middlewares/logger');

  // Create new unit
  app.post('/unit', function (req, res, next) {
    logger.reqLog(req, 'unit.create');
    next()
  },
    unit.create
  );

  // Get all units
  app.get('/unit', function (req, res, next) {
    logger.reqLog(req, 'unit.getAll');
    next()
  },
    unit.getAll
  );

  // Find unit by id
  app.get('/unit/:unitId', function (req, res, next) {
    logger.reqLog(req, 'unit.findById');
    next()
  },
    unit.findById
  );

  // Update unit by id
  app.put('/unit/:unitId', function (req, res, next) {
    logger.reqLog(req, 'unit.update');
    next()
  },
    unit.update
  );

  // Delete unit by id
  app.delete('/unit/:unitId', function (req, res, next) {
    logger.reqLog(req, 'unit.remove');
    next()
  },
    unit.remove
  );

  // Delete all units
  app.delete('/unit', function (req, res, next) {
    logger.reqLog(req, 'unit.removeAll');
    next()
  },
    unit.removeAll
  );

  // Disable a unit
  app.put('/unit/disable/:unitId', function (req, res, next) {
    logger.reqLog(req, 'unit.disable');
    next()
  },
    unit.disable
  );
}