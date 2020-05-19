module.exports = app => {

  const collection = require('../controllers/collection.controller');

  // create new collection
  app.post('/collection', collection.create);

  // get all collections
  app.get('/collection', collection.getAll);

  // find collection by id
  app.get('/collection/:collectionId', collection.findById);

  // update collection by id
  app.put('/collection/:collectionId', collection.update);

  // delete collection by id
  app.delete('/collection/:collectionId', collection.remove);

  // delete all collections
  app.delete('/collection', collection.removeAll);

  // disable a collection
  app.put('/collection/disable/:collectionId', collection.disable);
}