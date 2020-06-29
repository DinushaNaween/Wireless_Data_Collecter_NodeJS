const Unit = require('../models/unit.model');
const logger = require('../middlewares/logger.middleware');
const { stringToIntArray, stringToIntArrayBulk, updateChildArray } = require('../services/common.service');

// create and save new unit
exports.create = (req, res) => {  
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let unit = new Unit({
      unitName: req.body.unitName,
      unitLocation: req.body.unitLocation,
      parentNodes: null,
      collectionId: req.body.collectionId,
      createdUserId: req.body.createdUserId,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    Unit.create(unit, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the unit.'
        });
      } else {
        logger.info('unit created'); 

        let dataArray = [];
        dataArray.push(data);
        console.log(dataArray)
        let updateData = updateChildArray('collection', 'collectionId', 'units', data.collectionId, 'unitId', dataArray);

        updateData.then( function(newlyAddedId) {
          res.status(200).json({
            state: true,
            collectionUpdate: true,
            newlyAddedId: newlyAddedId,
            createdUnit: data 
          });
        }, function(err) { 
          logger.error('update collection table units column', err.message);
          res.status(200).json({
            state: true,
            collectionUpdate: false,
            createdUnit: data
          });
        })
      }
    });
  }
};

// get all units from database
exports.getAll = (req, res) => {
  Unit.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the units.'
      });
    } else {
      logger.info('getAll success');

      let structuredData = stringToIntArrayBulk(data, parentNodes)

      res.status(200).json({
        state: true,
        units: structuredData
      });
    }
  });
};

// get unit by id
exports.findById = (req, res) => {
  Unit.findById(req.params.unitId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found unit with id ' + req.params.unitId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving unit with id ' + req.params.unitId
        });
      }
    } else {
      logger.info('findById success');

      data.parentNodes = stringToIntArray(data.parentNodes);

      res.status(200).json({
        state: true,
        unit: data
      });
    }
  });
};

// update a unit
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();
    req.body.parentNodes.join();

    Unit.updateById(req.params.unitId, new Unit(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found unit with id ' + req.params.unitId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating unit with id ' + req.params.unitId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_unit: data
        });
      }
    })
  }
};

// delete a unit by id
exports.remove = (req, res) => {
  Unit.remove(req.params.unitId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found unit with id ' + req.params.unitId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete unit with id ' + req.params.unitId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Unit deleted successfully'
      });
    }
  });
};

// delete all units
exports.removeAll = (req, res) => {
  Unit.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all units.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All units deleted successfully'
      });
    }
  })
};

// disable a unit
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Unit.disable(req.params.unitId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found unit with id ' + req.params.unitId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating unit with id ' + req.params.unitId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled unit with id: ' + data.id +'.'
        });
      }
    })
  }
};