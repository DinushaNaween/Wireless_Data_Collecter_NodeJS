const Privilege = require('../models/privilege.model');

//create and save new privilege
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    const privilege = new Privilege({
      privilegeDescription: req.body.privilegeDescription,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    Privilege.create(privilege, (err, data) => {
      if (err) {
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the privilege.'
        });
      } else {
        res.status(200).json({
          state: true,
          created_privilege: data
        });
      }
    });
  }
};

// get all privileges from database
exports.getAll = (req, res) => {
  Privilege.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the privileges.'
      });
    } else {
      res.status(200).json({
        state: true,
        privileges: data
      });
    }
  });
};

// get privilege by id
exports.findById = (req, res) => {
  Privilege.findById(req.params.privilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving privilege with id ' + req.params.privilegeId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        privilege: data
      });
    }
  });
};

// update a privilege
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Privilege.updateById(req.params.privilegeId, new Privilege(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            state: false,
            message: 'Not found privilege with id ' + req.params.privilegeId
          });
        } else {
          res.status(500).json({
            state: false,
            message: 'Error updating privilege with id ' + req.params.privilegeId
          });
        }
      } else {
        res.status(200).json({
          state: true,
          updated_privilege: data
        });
      }
    })
  }
};

// delete a privilege by id
exports.remove = (req, res) => {
  Privilege.remove(req.params.privilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found privilege with id ' + req.params.privilegeId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete privilege with id ' + req.params.privilegeId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'Privilege deleted successfully'
      });
    }
  });
};

// delete all privileges
exports.removeAll = (req, res) => {
  Privilege.removeAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all privileges.'
      });
    } else {
      res.status(200).json({
        state: true,
        message: 'All privileges deleted successfully'
      });
    }
  })
};

// disable a privilege
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Privilege.disable(req.params.privilegeId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          res.status(404).json({
            state: false,
            message: 'Not found privilege with id ' + req.params.privilegeId
          });
        } else {
          res.status(500).json({
            state: false,
            message: 'Error updating privilege with id ' + req.params.privilegeId
          });
        }
      } else {
        res.status(200).json({
          state: true,
          message: 'Disabled privilege with id: ' + data.id +'.'
        });
      }
    })
  }
};