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
    console.log(newRole);
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created role: ', { id: res.insertId, ...newRole });
    result(null, { id: res.insertId, ...newRole });
  });
};

// get all roles from database
Role.getAll = (result) => {
  sql.query('SELECT * FROM role', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Roles: ', res);
    result(null, res);
    return
  });
};

// get role by id
Role.findById = (roleId, result) => {
  sql.query('SELECT * FROM role WHERE roleId =' + roleId, (err, res) => {
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
  });
};

// disable a role
Role.disable = (roleId, role, result) => {
  sql.query('UPDATE role SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [role.lastModifiedUser, role.lastModifiedDateTime, roleId], (err, res) => {
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
  })
};

module.exports = Role;