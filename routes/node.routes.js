module.exports = app => {

  const node = require('../controllers/node.controller');

  // create new node
  app.post('/node', node.create);

  // get all nodes
  app.get('/node', node.getAll);

  // find node by id
  app.get('/node/:nodeId', node.findById);

  // update node by id
  app.put('/node/:nodeId', node.update);

  // delete node by id
  app.delete('/node/:nodeId', node.remove);

  // delete all nodes
  app.delete('/node', node.removeAll);

  // disable a node
  app.put('/node/disable/:nodeId', node.disable);
}