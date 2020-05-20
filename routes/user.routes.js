module.exports = app => {

  const user = require('../controllers/user.controller');

  // Create new user
  app.post('/user', user.create);

  // User login
  app.post('/user/login', user.login);

  // Get all users
  app.get('/user', user.getAll);

  // Find user by id
  app.get('/user/:userId', user.findById);

  // Update user by id
  app.put('/user/:userId', user.update);

  // Delete user by id
  app.delete('/user/:userId', user.remove);

  // Delete all users
  app.delete('/user', user.removeAll);

  // Disable a user
  app.put('/user/disable/:userId', user.disable);
}