const Collection = require('../models/collection.model');

// create and save new collection
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const collection = new Collection({
    collectionName: req.body.collectionName,
    collectionLocation: req.body.collectionLocation,
    noOfUnits: req.body.noOfUnits,
    createdUserId: req.body.createdUserId,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  Collection.create(collection, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while creating the collection.'
      });
    } else {
      res.status(200).json({
        state: true,
        created_collection: data
      });
    }
  });
};

// get all collections from database
exports.getAll = (req, res) => {
  Collection.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the collections.'
      });
    } else {
      res.status(200).json({
        state: true,
        collections: data
      });
    }
  });
};

// get collection by id
exports.findById = (req, res) => {
  Collection.findById(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving collection with id ' + req.params.collectionId
        });
      }
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Collection.updateById(req.params.collectionId, new Collection(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating collection with id ' + req.params.collectionId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        updated_collection: data
      });
    }
  })
};

// delete a collection by id
exports.remove = (req, res) => {
  Collection.remove(req.params.collectionId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete collection with id ' + req.params.collectionId
        });
      }
    } else {
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
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all collections.'
      });
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Collection.disable(req.params.collectionId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found collection with id ' + req.params.collectionId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating collection with id ' + req.params.collectionId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'Disabled collection with id: ' + data.id +'.'
      });
    }
  })
};