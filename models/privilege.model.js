const sql = require('../config/db.config');

const Privilege = function(privilege) {
  this.privilegeDescription = privilege.privilegeDescription;
  this.disabled = privilege.disabled;
  this.lastModifiedUser = privilege.lastModifiedUser;
  this.lastModifiedDateTime = privilege.lastModifiedDateTime;
};

// create and save new privilege
Privilege.create = (newPrivilege, result) => {
  sql.query('INSERT INTO privilege SET ?', newPrivilege, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Created privilege: ', { id: res.insertId, ...newPrivilege });
    result(null, { id: res.insertId, ...newPrivilege });
    return;
  });
};

// get all privileges from database
Privilege.getAll = (result) => {
  sql.query('SELECT * FROM privilege', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Privileges: ', res);
    result(null, res);
    return;
  });
};

// get privilege by id
Privilege.findById = (privilegeId, result) => {
  sql.query('SELECT * FROM privilege WHERE privilegeId = ?', [privilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found privilege: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a privilege
Privilege.updateById = (privilegeId, privilege, result) => {
  sql.query('UPDATE privilege SET privilegeDescription = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE privilegeId = ?', [privilege.privilegeDescription, privilege.disabled, privilege.lastModifiedUser, privilege.lastModifiedDateTime, privilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('updated privilege: ', { id: privilegeId, ...privilege });
    result(null, { id: privilegeId, ...privilege });
    return;
  });
};

// delete a privilege by id
Privilege.remove = (privilegeId, result) => {
  sql.query('DELETE FROM privilege WHERE privilegeId = ?', [privilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted privilege with id: ', privilegeId);
    result(null, res);
    return;
  });
};

// delete all privileges
Privilege.removeAll = result => {
  sql.query('DELETE FROM privilege', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s privileges.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a privilege
Privilege.disable = (privilegeId, privilege, result) => {
  sql.query('UPDATE privilege SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE privilegeId = ?', [privilege.lastModifiedUser, privilege.lastModifiedDateTime, privilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled privilege: ', { id: privilegeId });
    result(null, { id: privilegeId });
    return;
  })
};

module.exports = Privilege;