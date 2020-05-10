const Role = require('../models/role.model');

// create and save new role
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
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
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the role.'
      });
    } else res.send(data);
  });
};

// get all roles from database
exports.getAll = (req, res) => {
  Role.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the roles.'
      });
    } else res.send(data);
  });
};

// get role by id
exports.findById = (req, res) => {
  Role.findById(req.params.roleId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving role with id ' + req.params.roleId
        });
      }
    } else res.send(data);
  });
};

// update a role
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Role.updateById(req.params.roleId, new Role(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).send({
          message: 'Error updating role with id ' + req.params.roleId
        });
      }
    } else res.send(data);
  })
};

// delete a role by id
exports.remove = (req, res) => {
  Role.remove(req.params.roleId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete role with id ' + req.params.roleId
        });
      }
    } else res.send({ message: 'Role deleted successfully!' })
  });
};

// delete all roles
exports.removeAll = (req, res) => {
  Role.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all roles.'
      });
    } else res.send({ message: 'All roles deleted successfully.' })
  })
};

// disable a role
exports.disable = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  Role.disable(req.params.roleId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        res.status(500).send({
          message: 'Error updating role with id ' + req.params.roleId
        });
      }
    } else res.send({ message: 'Disabled role with id: ' + data.id +'.' });
  })
};