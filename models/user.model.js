const sql = require('../config/db.config');

const User = function (user) {
  this.email = user.email;
  this.userName = user.userName;
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.loginPassword = user.loginPassword;
  this.roleId = user.roleId;
  this.disabled = user.disabled;
  this.lastModifiedUser = user.lastModifiedUser;
  this.lastModifiedDateTime = user.lastModifiedDateTime;
};

// Create and save new user
User.create = (newUser, result) => {
  sql.query('INSERT INTO user SET ?', newUser, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created user: ', { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
    return;
  });
};

// Get all users from database
User.getAll = (result) => {
  sql.query('SELECT * FROM user', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Users: ', res);
    result(null, res);
    return;
  });
};

// Get user by id
User.findById = (userId, result) => {
  sql.query('SELECT * FROM user WHERE userId =' + userId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found user: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// Update a user
User.updateById = (userId, user, result) => {
  sql.query('UPDATE user SET userName = ?, firstName = ?, lastName = ?, roleId = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE userId = ?', [user.userName, user.firstName, user.lastName, user.roleId, user.disabled, user.lastModifiedUser, user.lastModifiedDateTime, userId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated user: ', { id: userId, ...user });
    result(null, { id: userId, ...user });
    return;
  });
};

// Change email address 
User.changeEmailAddress = (userId, data, result) => {
  sql.query('UPDATE user SET email = REPLACE(email, ?, ?), lastModifiedUser = ?, lastModifiedDateTime = ? WHERE userId = ?', [data.currentEmail, data.newEmail, data.lastModifiedUser, data.lastModifiedDateTime, userId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated user email');
    result(null, res);
    return;
  })
}

// Delete a user by id
User.remove = (userId, result) => {
  sql.query('DELETE FROM user WHERE userId = ?', userId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted user with id: ', userId);
    result(null, res);
    return;
  });
};

// Delete all users
User.removeAll = result => {
  sql.query('DELETE FROM user', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s users.', res.affectedRows);
    result(null, res);
    return;
  });
};

// Disable a user
User.disable = (userId, user, result) => {
  sql.query('UPDATE user SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE userId = ?', [user.lastModifiedUser, user.lastModifiedDateTime, userId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled user: ', { id: userId });
    result(null, { id: userId });
    return;
  });
};

// User find by email
User.findByEmail = (userEmail, result) => {
  sql.query('SELECT * FROM user WHERE email = ?', [userEmail], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('User: ', res);
    result(null, res);
    return;
  });
};

module.exports = User;