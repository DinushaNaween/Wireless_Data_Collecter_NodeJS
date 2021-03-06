module.exports = app => {

  const role = require('../controllers/role.controller');

  const { reqLog } = require('../middlewares/logger.middleware');
  const { tokenAuthentication, checkIfSuperAdmin, checkIfAdmin } = require('../middlewares/jwtAuth.middleware');

  // Create new role
  app.post('/role', function (req, res, next) {
    reqLog(req, 'role.create');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.create
  );

  // Get all roles
  app.get('/role', function (req, res, next) {
    reqLog(req, 'role.getAll');
    next();
  },
    role.getAll
  );

  // Get all disabled roles
  app.get('/role/disable/', function (req, res, next) {
    reqLog(req, 'role.getAllDisabled');
    next();
  },
    role.getAllDisabled
  );

  // Find role by id
  app.get('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.findById');
    next();
  },
    role.findById
  );

  // Update role by id
  app.put('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.update');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.update
  );

  // Delete role by id
  app.delete('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.remove');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.remove
  );

  // Delete all roles
  app.delete('/role', function (req, res, next) {
    reqLog(req, 'role.removeAll');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.removeAll
  );

  // Disable a role
  app.put('/role/disable/:roleId', function (req, res, next) {
    reqLog(req, 'role.disable');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.disable
  );

  // Enable a role
  app.put('/role/enable/:roleId', function (req, res, next) {
    reqLog(req, 'role.enable');
    tokenAuthentication(req, res, next);
    checkIfSuperAdmin(req, res, next);
  },
    role.enable
  );
}