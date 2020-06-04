module.exports = app => {

  const rolePrivilege = require('../controllers/rolePrivilege.controller');
  const { reqLog } = require('../middlewares/logger');

  // Create new rolePrivilege
  app.post('/rolePrivilege', function (req, res, next) {
    reqLog(req, 'rolePrivilege.create');
    next()
  },
    rolePrivilege.create
  );

  // Get all rolePrivileges
  app.get('/rolePrivilege', function (req, res, next) {
    reqLog(req, 'rolePrivilege.getAll');
    next()
  },
    rolePrivilege.getAll
  );

  // Find rolePrivilege by id
  app.get('/rolePrivilege/:rolePrivilegeId', function (req, res, next) {
    reqLog(req, 'rolePrivilege.findById');
    next()
  },
    rolePrivilege.findById
  );

  // Update rolePrivilege by id
  app.put('/rolePrivilege/:rolePrivilegeId', function (req, res, next) {
    reqLog(req, 'rolePrivilege.update');
    next()
  },
    rolePrivilege.update
  );

  // Delete rolePrivilege by id
  app.delete('/rolePrivilege/:rolePrivilegeId', function (req, res, next) {
    reqLog(req, 'rolePrivilege.remove');
    next()
  },
    rolePrivilege.remove
  );

  // Delete all rolePrivileges
  app.delete('/rolePrivilege', function (req, res, next) {
    reqLog(req, 'rolePrivilege.removeAll');
    next()
  },
    rolePrivilege.removeAll
  );

  // Disable a rolePrivilege
  app.put('/rolePrivilege/disable/:rolePrivilegeId', function (req, res, next) {
    reqLog(req, 'rolePrivilege.disable');
    next()
  },
    rolePrivilege.disable
  );
}