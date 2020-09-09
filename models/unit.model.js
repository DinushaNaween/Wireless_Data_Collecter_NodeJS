const mysql = require('../config/db.config');
const sql = mysql.connection;

const Unit = function (unit) {
  this.unitName = unit.unitName;
  this.unitLocation = unit.unitLocation;
  this.parentNodes = unit.parentNodes;
  this.collectionId = unit.collectionId;
  this.createdUserId = unit.createdUserId;
  this.disabled = unit.disabled;
  this.lastModifiedUser = unit.lastModifiedUser;
  this.lastModifiedDateTime = unit.lastModifiedDateTime;
};

// create and save new unit
Unit.create = (newUnit, result) => {
  sql.query('INSERT INTO unit SET ?', newUnit, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created unit: ', { unitId: res.insertId, ...newUnit });
    result(null, { unitId: res.insertId, ...newUnit });
    return;
  });
};

// get all units from database
Unit.getAll = (result) => {
  sql.query('SELECT * FROM unit', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Units: ', res);
    result(null, res);
    return
  });
};

// get unit by id
Unit.findById = (unitId, result) => {
  sql.query('SELECT * FROM unit WHERE unitId =' + unitId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found unit: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a unit
Unit.updateById = (unitId, unit, result) => {
  sql.query('UPDATE unit SET unitName = ?, unitLocation = ?, parentNodes = ?, collectionId = ?, createdUserId = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE unitId = ?', [unit.unitName, unit.unitLocation, unit.parentNodes, unit.collectionId, unit.createdUserId, unit.disabled, unit.lastModifiedUser, unit.lastModifiedDateTime, unitId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated unit: ', { id: unitId, ...unit });
    result(null, { id: unitId, ...unit });
    return;
  });
};

// delete a unit by id
Unit.remove = (unitId, result) => {
  sql.query('DELETE FROM unit WHERE unitId = ?', unitId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted unit with id: ', unitId);
    result(null, res);
    return;
  });
};

// delete all units
Unit.removeAll = result => {
  sql.query('DELETE FROM unit', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s units.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a unit
Unit.disable = (unitId, unit, result) => {
  sql.query('UPDATE unit SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE unitId = ?', [unit.lastModifiedUser, unit.lastModifiedDateTime, unitId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled unit: ', { id: unitId });
    result(null, { id: unitId });
    return;
  })
};

module.exports = Unit;