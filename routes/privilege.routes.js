module.exports = app => {

  const privilege = require('../controllers/privilege.controller');

  // create new privilege
  app.post('/privilege', privilege.create);

  // get all privileges
  app.get('/privilege', privilege.getAll);

  // find privilege by id
  app.get('/privilege/:privilegeId', privilege.findById);

  // update privilege by id
  app.put('/privilege/:privilegeId', privilege.update);

  // delete privilege by id
  app.delete('/privilege/:privilegeId', privilege.remove);

  // delete all privileges
  app.delete('/privilege', privilege.removeAll);

  // disable a privilege
  app.put('/privilege/disable/:privilegeId', privilege.disable);
}