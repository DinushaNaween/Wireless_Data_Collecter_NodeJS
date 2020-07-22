const Role = require('../models/role.model');
const logger = require('../middlewares/logger.middleware');

// create and save new role
exports.create = (req, res) => {
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      error_code: 1,
      message: 'Content can not be empty!'
    });
  } else {
    let role = new Role({
      roleName: req.body.roleName,
      disabled: 0,
      lastModifiedUser: null,
      lastModifiedDateTime: new Date()
    });
  
    Role.create(role, (err, data) => {
      if (err) {
        logger.error('create', err.message);
        res.status(500).json({
          state: false,
          error_code: 2,
          message: err.message || 'Some error occurred while creating the role.'
        });
      } else {
        logger.info('role created');
        res.status(200).json({
          state: true,
          created_role: data
        });
      }
    });
  }
};

// get all roles from database
exports.getAll = (req, res) => {
  Role.getAll((err, data) => {
    if (err) {
      logger.error('getAll', err.message);
      res.status(500).json({
        state: false,
        error_code: 2,
        message: err.message || 'Some error occurred while retrieving the roles.'
      });
    } else {
      logger.info('getAll success');
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
        logger.error('findById notFound');
        res.status(404).json({
          state: false,
          error_code: 3,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        logger.error('findById', err.message);
        res.status(500).json({
          state: false,
          error_code: 2,
          message: 'Error retrieving role with id ' + req.params.roleId
        });
      }
    } else {
      logger.info('findById success');
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
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      error_code: 1,
      message: 'Content can not be empty!'
    });
  } else {
    let role = new Role({
      roleName: req.body.roleName,
      disabled: 0,
      lastModifiedUser: req.body.lastModifiedUser,
      lastModifiedDateTime: new Date()
    });

    Role.updateById(req.params.roleId, role, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('updateById notFound');
          res.status(404).json({
            state: false,
            error_code: 3,
            message: 'Not found role with id ' + req.params.roleId
          });
        } else {
          logger.error('updateById', err.message);
          res.status(500).json({
            state: false,
            error_code: 2,
            message: 'Error updating role with id ' + req.params.roleId
          });
        }
      } else {
        logger.info('update success');
        res.status(200).json({
          state: true,
          updated_role: data
        });
      }
    })
  }
};

// delete a role by id
exports.remove = (req, res) => {
  Role.remove(req.params.roleId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        logger.error('remove notFound');
        res.status(404).json({
          state: false,
          error_code: 3,
          message: 'Not found role with id ' + req.params.roleId
        });
      } else {
        logger.error('remove', err.message);
        res.status(500).json({
          state: false,
          error_code: 2,
          message: 'Could not delete role with id ' + req.params.roleId
        });
      }
    } else {
      logger.info('remove success');
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
      logger.error('removeAll', err.message);
      res.status(500).json({
        state: false,
        error_code: 2,
        message: err.message || 'Some error occurred while deleting all roles.'
      });
    } else {
      logger.info('removeAll success');
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
    logger.error('empty req.body');
    res.status(400).json({
      state: false,
      error_code: 1,
      message: 'Content can not be empty!'
    });
  } else {
    req.body.lastModifiedDateTime = new Date();

    Role.disable(req.params.roleId, req.body, (err, data) => {
      if (err) {
        if (err.kind === 'not_found') {
          logger.error('disable notFound');
          res.status(404).json({
            state: false,
            error_code: 3,
            message: 'Not found role with id ' + req.params.roleId
          });
        } else {
          logger.error('disable', err.message);
          res.status(500).json({
            state: false,
            error_code: 2,
            message: 'Error updating role with id ' + req.params.roleId
          });
        }
      } else {
        logger.info('disable success');
        res.status(200).json({
          state: true,
          message: 'Disabled role with id: ' + data.id +'.'
        });
      }
    })
  }
};