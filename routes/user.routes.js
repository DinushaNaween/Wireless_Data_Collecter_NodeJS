module.exports = app => {

  const user = require('../controllers/user.controller');

  // create new user
  app.post('/user', user.create);

  app.post('/user/login', user.login);

  // get all users
  app.get('/user', user.getAll);

  // find user by id
  app.get('/user/:userId', user.findById);

  // update user by id
  app.put('/user/:userId', user.update);

  // delete user by id
  app.delete('/user/:userId', user.remove);

  // delete all users
  app.delete('/user', user.removeAll);

  // disable a user
  app.put('/user/disable/:userId', user.disable);
}