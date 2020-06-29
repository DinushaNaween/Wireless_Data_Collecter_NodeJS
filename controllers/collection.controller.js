const Collection = require('../models/collection.model');
const logger = require('../middlewares/logger.middleware');
const { stringToIntArray, stringToIntArrayBulk } = require('../services/common.service');

// create and save new collection
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let collection = new Collection({
      collectionName: req.body.collectionName,
      collectionLocation: req.body.collectionLocation,
      units: req.body.units.join(),
      createdUserId: req.body.createdUserId,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    Collection.create(collection, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the collection.'
        });
      } else {
        logger.info('unit created');
        res.status(200).json({
          state: true,
          created_collection: data
        });
      }
    });
  }
};

// get all collections from database
exports.getAll = (req, res) => {
  Collection.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the collections.'
      });
    } else {
      logger.info('getAll success');

      let structuredData = stringToIntArrayBulk(data, units);

      res.status(200).json({
        state: true,
        collections: structuredData
      });
    }
  });
};

// get collection by id
exports.findById = (req, res) => {
  Collection.findById(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving collection with id ' + req.params.collectionId
        });
      }
    } else {
      logger.info('findById success');

      data.units = stringToIntArray(data.units);

      res.status(200).json({
        state: true,
        collection: data
      });
    }
  });
};

// update a collection
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();
    req.body.units.join();

    Collection.updateById(req.params.collectionId, new Collection(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found collection with id ' + req.params.collectionId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating collection with id ' + req.params.collectionId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_collection: data
        });
      }
    })
  }
};

// delete a collection by id
exports.remove = (req, res) => {
  Collection.remove(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete collection with id ' + req.params.collectionId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Collection deleted successfully'
      });
    }
  });
};

// delete all collections
exports.removeAll = (req, res) => {
  Collection.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all collections.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All collections deleted successfully'
      });
    }
  })
};

// disable a collection
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Collection.disable(req.params.collectionId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found collection with id ' + req.params.collectionId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating collection with id ' + req.params.collectionId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled collection with id: ' + data.id +'.'
        });
      }
    })
  }
};