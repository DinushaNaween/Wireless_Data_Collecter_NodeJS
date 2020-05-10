module.exports = app => {
  
  const rolePrivilege = require('../controllers/rolePrivilege.controller');

  // create new rolePrivilege
  app.post('/rolePrivilege', rolePrivilege.create);

  // get all rolePrivileges
  app.get('/rolePrivilege', rolePrivilege.getAll);

  // find rolePrivilege by id
  app.get('/rolePrivilege/:rolePrivilegeId', rolePrivilege.findById);

  // update rolePrivilege by id
  app.put('/rolePrivilege/:rolePrivilegeId', rolePrivilege.update);

  // delete rolePrivilege by id
  app.delete('/rolePrivilege/:rolePrivilegeId', rolePrivilege.remove);

  // delete all rolePrivileges
  app.delete('/rolePrivilege', rolePrivilege.removeAll);

  // disable a rolePrivilege
  app.put('/rolePrivilege/disable/:rolePrivilegeId', rolePrivilege.disable);
}