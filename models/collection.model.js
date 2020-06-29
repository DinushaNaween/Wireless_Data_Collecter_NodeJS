const sql = require('../config/db.config');

const Collection = function (collection) {
  this.collectionName = collection.collectionName;
  this.collectionLocation = collection.collectionLocation;
  this.units = collection.units;
  this.createdUserId = collection.createdUserId;
  this.disabled = collection.disabled;
  this.lastModifiedUser = collection.lastModifiedUser;
  this.lastModifiedDateTime = collection.lastModifiedDateTime;
};

// create and save new collection
Collection.create = (newCollection, result) => {
  sql.query('INSERT INTO collection SET ?', newCollection, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created collection: ', { id: res.insertId, ...newCollection });
    result(null, { id: res.insertId, ...newCollection });
    return;
  });
};

// get all collections from database
Collection.getAll = (result) => {
  sql.query('SELECT * FROM collection', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Collections: ', res);
    result(null, res);
    return;
  });
};

// get collection by id
Collection.findById = (collectionId, result) => {
  sql.query('SELECT * FROM collection WHERE collectionId =' + collectionId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found collection: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a collection
Collection.updateById = (collectionId, collection, result) => {
  sql.query('UPDATE collection SET collectionName = ?, collectionLocation = ?, units = ?, createdUserId = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE collectionId = ?', [collection.collectionName, collection.collectionLocation, collection.units, collection.createdUserId, collection.disabled, collection.lastModifiedUser, collection.lastModifiedDateTime, collectionId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated collection: ', { id: collectionId, ...collection });
    result(null, { id: collectionId, ...collection });
    return;
  });
};

// delete a collection by id
Collection.remove = (collectionId, result) => {
  sql.query('DELETE FROM collection WHERE collectionId = ?', collectionId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted collection with id: ', collectionId);
    result(null, res);
    return;
  });
};

// delete all collections
Collection.removeAll = result => {
  sql.query('DELETE FROM collection', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s collections.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a collection
Collection.disable = (collectionId, collection, result) => {
  sql.query('UPDATE collection SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE collectionId = ?', [collection.lastModifiedUser, collection.lastModifiedDateTime, collectionId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled collection: ', { id: collectionId });
    result(null, { id: collectionId });
    return;
  })
};

module.exports = Collection;