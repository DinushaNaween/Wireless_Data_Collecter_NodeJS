const RolePrivilege = require('../models/rolePrivilege.model');
const logger = require('../logger/logger');

// create and save new role privilege
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    let rolePrivilege = new RolePrivilege({
      roleId: req.body.roleId,
      privilegeId: req.body.privilegeId,
      disabled: req.body.disabled,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });
  
    RolePrivilege.create(rolePrivilege, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          message: err.message || 'Some error occurred while creating the role privilege.'
        });
      } else { 
        logger.info('rolePrivilege created');
        res.status(200).json({
          state: true,
          created_rolePrivilege: data
        });
      }
    });
  }
};
 
// get all role privileges from database
exports.getAll = (req, res) => {
  RolePrivilege.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while retrieving the role privileges.'
      });
    } else {
      logger.info('getAll success');
      res.status(200).json({
        state: true,
        rolePrivileges: data
      });
    }
  });
};

// get role privilege by id
exports.findById = (req, res) => {
  RolePrivilege.findById(req.params.rolePrivilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          message: 'Error retrieving role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else {
      logger.info('findById success');
      res.status(200).json({
        state: true,
        rolePrivilege: data
      });
    }
  });
};

// update a role privilege
exports.update = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    RolePrivilege.updateById(req.params.rolePrivilegeId, new RolePrivilege(req.body), (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
          });
        } else {
          logger.error('findById', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating role privilege with id ' + req.params.rolePrivilegeId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_rolePrivilege: data
        });
      }
    })
  }
};

// delete a role privilege by id
exports.remove = (req, res) => {
  RolePrivilege.remove(req.params.rolePrivilegeId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          message: 'Could not delete role privilege with id ' + req.params.rolePrivilegeId
        });
      }
    } else {
      logger.info('remove success');
      res.status(200).json({
        state: true,
        message: 'Role privilege deleted successfully'
      });
    }
  });
};

// delete all role privileges
exports.removeAll = (req, res) => {
  RolePrivilege.removeAll((err, data) => {
    if (err) {
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        message: err.message || 'Some error occurred while deleting all role privileges.'
      });
    } else {
      logger.info('removeAll success');
      res.status(200).json({
        state: true,
        message: 'All role privileges deleted successfully'
      });
    }
  })
};

// disable a role privilege
exports.disable = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    RolePrivilege.disable(req.params.rolePrivilegeId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            message: 'Not found role privilege with id ' + req.params.rolePrivilegeId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            message: 'Error updating role privilege with id ' + req.params.rolePrivilegeId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled role privilege with id: ' + data.id +'.'
        });
      }
    })
  }
};