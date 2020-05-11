module.exports = app => {

  const role = require('../controllers/role.controller');

  // create new role
  app.post('/role', role.create);

  // get all roles
  app.get('/role', role.getAll);

  // find role by id
  app.get('/role/:roleId', role.findById);

  // update role by id
  app.put('/role/:roleId', role.update);

  // delete role by id
  app.delete('/role/:roleId', role.remove);

  // delete all roles
  app.delete('/role', role.removeAll);

  // disable a role
  app.put('/role/disable/:roleId', role.disable);
}