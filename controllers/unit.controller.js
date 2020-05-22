const Unit = require('../models/unit.model');

// create and save new unit
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    const unit = new Unit({
      unitName: req.body.unitName,
      unitLocation: req.body.unitLocation,
      noOfParentNodes: req.body.noOfParentNodes,
      collectionId: req.body.collectionId,
      createdUserId: req.body.createdUserId,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    Unit.create(unit, (err, data) => {
      if (err) {
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the unit.'
        });
      } else {
        res.status(200).json({
          state: true,
          created_unit: data
        });
      }
    });
  }
};

// get all units from database
exports.getAll = (req, res) => {
  Unit.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the units.'
      });
    } else {
      res.status(200).json({
        state: true,
        units: data
      });
    }
  });
};

// get unit by id
exports.findById = (req, res) => {
  Unit.findById(req.params.unitId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found unit with id ' + req.params.unitId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving unit with id ' + req.params.unitId
        });
      }
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Unit.updateById(req.params.unitId, new Unit(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            state: false,
            message: 'Not found unit with id ' + req.params.unitId
          });
        } else {
          res.status(500).json({
            state: false,
            message: 'Error updating unit with id ' + req.params.unitId
          });
        }
      } else {
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
        res.status(404).json({
          state: false,
          message: 'Not found unit with id ' + req.params.unitId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete unit with id ' + req.params.unitId
        });
      }
    } else {
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
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all units.'
      });
    } else {
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
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Unit.disable(req.params.unitId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            state: false,
            message: 'Not found unit with id ' + req.params.unitId
          });
        } else {
          res.status(500).json({
            state: false,
            message: 'Error updating unit with id ' + req.params.unitId
          });
        }
      } else {
        res.status(200).json({
          state: true,
          message: 'Disabled unit with id: ' + data.id +'.'
        });
      }
    })
  }
};