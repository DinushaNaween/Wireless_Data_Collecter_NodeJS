const sql = require('../config/db.config');

const ParentNode = function (parentNode) {
  this.parentNodeName = parentNode.parentNodeName;
  this.parentNodeLocation = parentNode.parentNodeLocation;
  this.noOfNodes = parentNode.noOfNodes;
  this.unitId = parentNode.unitId;
  this.collectionId = parentNode.collectionId;
  this.createdUserId = parentNode.createdUserId;
  this.disabled = parentNode.disabled;
  this.lastModifiedUser = parentNode.lastModifiedUser;
  this.lastModifiedDateTime = parentNode.lastModifiedDateTime;
};

// create and save new parentNode
ParentNode.create = (newParentNode, result) => {
  sql.query('INSERT INTO parentNode SET ?', newParentNode, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created parent node: ', { id: res.insertId, ...newParentNode });
    result(null, { id: res.insertId, ...newParentNode });
  });
};

// get all parent nodes from database
ParentNode.getAll = (result) => {
  sql.query('SELECT * FROM parentNode', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Parent nodes: ', res);
    result(null, res);
    return
  });
};

// get parentNode by id
ParentNode.findById = (parentNodeId, result) => {
  sql.query('SELECT * FROM parentNode WHERE parentNodeId =' + parentNodeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found parent node: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
  });
};

// update a parentNode
ParentNode.updateById = (parentNodeId, parentNode, result) => {
  sql.query('UPDATE parentNode SET parentNodeName = ?, parentNodeLocation = ?, noOfNodes = ?, unitId = ?, collectionId = ?, createdUserId = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE parentNodeId = ?', [parentNode.parentNodeName, parentNode.parentNodeLocation, parentNode.noOfNodes, parentNode.unitId, parentNode.collectionId, parentNode.createdUserId, parentNode.disabled, parentNode.lastModifiedUser, parentNode.lastModifiedDateTime, parentNodeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated parent node: ', { id: parentNodeId, ...parentNode });
    result(null, { id: parentNodeId, ...parentNode });
  });
};

// delete a parentNode by id
ParentNode.remove = (parentNodeId, result) => {
  sql.query('DELETE FROM parentNode WHERE parentNodeId = ?', parentNodeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted parent node with id: ', parentNodeId);
    result(null, res);
  });
};

// delete all parent nodes
ParentNode.removeAll = result => {
  sql.query('DELETE FROM parentNode', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s parent nodes.', res.affectedRows);
    result(null, res);
  });
};

// disable a parentNode
ParentNode.disable = (parentNodeId, parentNode, result) => {
  sql.query('UPDATE parentNode SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE parentNodeId = ?', [parentNode.lastModifiedUser, parentNode.lastModifiedDateTime, parentNodeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled parent node: ', { id: parentNodeId });
    result(null, { id: parentNodeId });
  })
};

module.exports = ParentNode;