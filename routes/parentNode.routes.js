module.exports = app => {

  const parentNode = require('../controllers/parentNode.controller');

  // create new parentNode
  app.post('/parentNode', parentNode.create);

  // get all parentNodes
  app.get('/parentNode', parentNode.getAll);

  // find parentNode by id
  app.get('/parentNode/:parentNodeId', parentNode.findById);

  // update parentNode by id
  app.put('/parentNode/:parentNodeId', parentNode.update);

  // delete parentNode by id
  app.delete('/parentNode/:parentNodeId', parentNode.remove);

  // delete all parentNodes
  app.delete('/parentNode', parentNode.removeAll);

  // disable a parentNode
  app.put('/parentNode/disable/:parentNodeId', parentNode.disable);
}