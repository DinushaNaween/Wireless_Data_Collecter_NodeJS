const Role = require('../models/role.model');

// create and save new role
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  const role = new Role({
    roleName: req.body.roleName,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  Role.create(role, (err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while creating the role.'
      });
    } else {
      res.status(200).json({
        state: true,
        created_role: data
      });
    }
  });
};

// get all roles from database
exports.getAll = (req, res) => {
  Role.getAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the roles.'
      });
    } else {
      res.status(200).json({
        state: true,
        roles: data
      });
    }
  });
};

// get role by id
exports.findById = (req, res) => {
  Role.findById(req.params.roleId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error retrieving role with id ' + req.params.roleId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        role: data
      });
    }
  });
};

// update a role
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Role.updateById(req.params.roleId, new Role(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating role with id ' + req.params.roleId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        updated_role: data
      });
    }
  })
};

// delete a role by id
exports.remove = (req, res) => {
  Role.remove(req.params.roleId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Could not delete role with id ' + req.params.roleId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'Role deleted successfully'
      });
    }
  });
};

// delete all roles
exports.removeAll = (req, res) => {
  Role.removeAll((err, data) => {
    if (err) {
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all roles.'
      });
    } else {
      res.status(200).json({
        state: true,
        message: 'All roles deleted successfully'
      });
    }
  })
};

// disable a role
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  }
  req.body.lastModifiedDateTime = new Date();

  Role.disable(req.params.roleId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).json({
          state: false,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).json({
          state: false,
          message: 'Error updating role with id ' + req.params.roleId
        });
      }
    } else {
      res.status(200).json({
        state: true,
        message: 'Disabled role with id: ' + data.id +'.'
      });
    }
  })
};