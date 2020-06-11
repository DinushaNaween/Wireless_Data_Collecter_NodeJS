module.exports = app => {

  const role = require('../controllers/role.controller');
  const { reqLog } = require('../middlewares/logger.middleware');

  // Create new role
  app.post('/role', function (req, res, next) {
    reqLog(req, 'role.create');
    next()
  },
    role.create
  );

  // Get all roles
  app.get('/role', function (req, res, next) {
    reqLog(req, 'role.getAll');
    next()
  },
    role.getAll
  );

  // Find role by id
  app.get('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.findById');
    next()
  },
    role.findById
  );

  // Update role by id
  app.put('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.update');
    next()
  },
    role.update
  );

  // Delete role by id
  app.delete('/role/:roleId', function (req, res, next) {
    reqLog(req, 'role.remove');
    next()
  },
    role.remove
  );

  // Delete all roles
  app.delete('/role', function (req, res, next) {
    reqLog(req, 'role.removeAll');
    next()
  },
    role.removeAll
  );

  // Disable a role
  app.put('/role/disable/:roleId', function (req, res, next) {
    reqLog(req, 'role.disable');
    next()
  },
    role.disable
  );
}