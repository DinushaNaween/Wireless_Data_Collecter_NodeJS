const RolePrivilege = require('../models/rolePrivilege.model');

// create and save new role privilege
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  const rolePrivilege = new RolePrivilege({
    roleId: req.body.roleId,
    privilegeId: req.body.privilegeId,
    disabled: req.body.disabled,
    lastModifiedUser: req.body.lastModifiedUser,
    lastModifiedDateTime: new Date()
  });

  RolePrivilege.create(rolePrivilege, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the role privilege.'
      });
    } else res.send(data);
  });
};

// get all role privileges from database
exports.getAll = (req, res) => {
  RolePrivilege.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving the role privileges.'
      });
    } else res.send(data);
  });
};

// get role privilege by id
exports.findById = (req, res) => {
  RolePrivilege.findById(req.params.rolePrivilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error retrieving role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else res.send(data);
  });
};

// update a role privilege
exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  RolePrivilege.updateById(req.params.rolePrivilegeId, new RolePrivilege(req.body), (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else res.send(data);
  })
};

// delete a role privilege by id
exports.remove = (req, res) => {
  RolePrivilege.remove(req.params.rolePrivilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        res.status(500).send({
          message: 'Could not delete role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else res.send({ message: 'Role privilege deleted successfully!' })
  });
};

// delete all role privileges
exports.removeAll = (req, res) => {
  RolePrivilege.removeAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting all role privileges.'
      });
    } else res.send({ message: 'All role privileges deleted successfully.' })
  })
};

// disable a role privilege
exports.disable = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
  }

  req.body.lastModifiedDateTime = new Date();

  RolePrivilege.disable(req.params.rolePrivilegeId, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        res.status(500).send({
          message: 'Error updating role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else res.send({ message: 'Disabled role privilege with id: ' + data.id +'.' });
  })
};