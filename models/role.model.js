const sql = require('../config/db.config');

const Role = function (role) {
  this.roleName = role.roleName;
  this.disabled = role.disabled;
  this.lastModifiedUser = role.lastModifiedUser;
  this.lastModifiedDateTime = role.lastModifiedDateTime;
};

// create and save new role
Role.create = (newRole, result) => {
  sql.query('INSERT INTO role SET ?', newRole, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created role: ', { id: res.insertId, ...newRole });
    result(null, { id: res.insertId, ...newRole });
    return;
  });
};

// get all roles from database
Role.getAll = (result) => {
  sql.query('SELECT * FROM role WHERE disabled = 0', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Roles: ', res);
    result(null, res);
    return;
  });
};

Role.getAllDisabled = (result) => {
  sql.query('SELECT * FROM role WHERE disabled = 1', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found role: ', res);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
}

// get role by id
Role.findById = (roleId, result) => {
  sql.query('SELECT * FROM role WHERE roleId = ? AND disabled = 0', [roleId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found role: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a role
Role.updateById = (roleId, role, result) => {
  sql.query('UPDATE role SET roleName = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [role.roleName, role.disabled, role.lastModifiedUser, role.lastModifiedDateTime, roleId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated role: ', { id: roleId, ...role });
    result(null, { id: roleId, ...role });
    return;
  });
};

// delete a role by id
Role.remove = (roleId, result) => {
  sql.query('DELETE FROM role WHERE roleId = ?', roleId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted role with id: ', roleId);
    result(null, res);
    return;
  });
};

// delete all roles
Role.removeAll = result => {
  sql.query('DELETE FROM role', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s roles.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a role
Role.disable = (roleId, reqBody, result) => {
  sql.query('UPDATE role SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [reqBody.loggedUser.userId, new Date(), roleId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled role: ', { id: roleId });
    result(null, { id: roleId });
    return;
  })
};

// enable a role
Role.enable = (roleId, reqBody, result) => {
  sql.query('UPDATE role SET disabled = 0, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [reqBody.loggedUser.userId, new Date(), roleId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Enabled role: ', { id: roleId });
    result(null, { id: roleId });
    return;
  })
};

module.exports = Role;