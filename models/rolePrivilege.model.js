const { query } = require('../config/db.config');

const RolePrivilege = function (rolePrivilege) {
  this.roleId = rolePrivilege.roleId;
  this.privilegeId = rolePrivilege.privilegeId;
  this.disabled = rolePrivilege.disabled;
  this.lastModifiedUser = rolePrivilege.lastModifiedUser;
  this.lastModifiedDateTime = rolePrivilege.lastModifiedDateTime;
};

// create and save new role privilege
RolePrivilege.create = (newRolePrivilege, result) => {
  query('INSERT INTO rolePrivilege SET ?', newRolePrivilege, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created role privilege: ', { id: res.insertId, ...newRolePrivilege });
    result(null, { id: res.insertId, ...newRolePrivilege });
    return;
  });
};

// get all role privileges from database
RolePrivilege.getAll = (result) => {
  query('SELECT * FROM rolePrivilege', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Role privileges: ', res);
    result(null, res);
    return;
  });
};

// get role privilege by id
RolePrivilege.findById = (rolePrivilegeId, result) => {
  query('SELECT * FROM rolePrivilege WHERE rolePrivilegeId =' + rolePrivilegeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found role privilege: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// update a role privilege
RolePrivilege.updateById = (rolePrivilegeId, rolePrivilege, result) => {
  query('UPDATE rolePrivilege SET roleId = ?, privilegeId =?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [rolePrivilege.roleId, rolePrivilege.privilegeId, rolePrivilege.disabled, rolePrivilege.lastModifiedUser, rolePrivilege.lastModifiedDateTime, rolePrivilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated role privilege: ', { id: rolePrivilegeId, ...rolePrivilege });
    result(null, { id: rolePrivilegeId, ...rolePrivilege });
    return;
  });
};

// delete a role privilege by id
RolePrivilege.remove = (rolePrivilegeId, result) => {
  query('DELETE FROM rolePrivilege WHERE rolePrivilegeId = ?', rolePrivilegeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted role privilege with id: ', rolePrivilegeId);
    result(null, res);
    return;
  });
};

// delete all role privileges
RolePrivilege.removeAll = result => {
  query('DELETE FROM rolePrivilege', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s role privileges.', res.affectedRows);
    result(null, res);
    return;
  });
};

// disable a role privilege
RolePrivilege.disable = (rolePrivilegeId, rolePrivilege, result) => {
  query('UPDATE rolePrivilege SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE roleId = ?', [rolePrivilege.lastModifiedUser, rolePrivilege.lastModifiedDateTime, rolePrivilegeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled role privilege: ', { id: rolePrivilegeId });
    result(null, { id: rolePrivilegeId });
    return;
  })
};

module.exports = RolePrivilege;