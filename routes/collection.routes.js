module.exports = app => {

  const collection = require('../controllers/collection.controller');
  const logger = require('../logger/logger');

  // Create new collection
  app.post('/collection', function (req, res, next) {
    logger.reqLog(req, 'collection.create');
    next()
  },
    collection.create
  );

  // Get all collections
  app.get('/collection', function (req, res, next) {
    logger.reqLog(req, 'collection.getAll');
    next()
  },
    collection.getAll
  );

  // Find collection by id
  app.get('/collection/:collectionId', function (req, res, next) {
    logger.reqLog(req, 'collection.findById');
    next()
  },
    collection.findById
  );

  // Update collection by id
  app.put('/collection/:collectionId', function (req, res, next) {
    logger.reqLog(req, 'collection.update');
    next()
  },
    collection.update
  );

  // Delete collection by id
  app.delete('/collection/:collectionId', function (req, res, next) {
    logger.reqLog(req, 'collection.remove');
    next()
  },
    collection.remove
  );

  // Delete all collections
  app.delete('/collection', function (req, res, next) {
    logger.reqLog(req, 'collection.removeAll');
    next()
  },
    collection.removeAll
  );

  // Disable a collection
  app.put('/collection/disable/:collectionId', function (req, res, next) {
    logger.reqLog(req, 'collection.disable');
    next()
  },
    collection.disable
  );
}