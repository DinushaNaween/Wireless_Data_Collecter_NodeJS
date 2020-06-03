const sql = require('../config/db.config');

const AuthToken = function(authToken) {
  this.userId = authToken.userId;
  this.refreshToken = authToken.refreshToken;
  this.revoked = authToken.revoked;
  this.createdDateTime = authToken.createdDateTime;
};

// Save new token
AuthToken.saveNewRefreshToken = (newToken, result) => {
  sql.query('INSERT INTO authToken SET ?', newToken, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Saved authToken: ', { id: res.insertId, ...newToken });
    result(null, { id: res.insertId, ...newToken });
    return;
  });
};

// Get all tokens
AuthToken.getAll = (result) => {
  sql.query('SELECT * FROM authToken', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Auth Tokens: ', res);
    result(null, res);
    return;
  });
};

// Get token by id
AuthToken.findById = (tokenId, result) => {
  sql.query('SELECT * FROM authToken WHERE tokenId = ?', [tokenId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found authToken: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
    return;
  });
};

// delete a authToken by id
AuthToken.remove = (tokenId, result) => {
  sql.query('DELETE FROM authToken WHERE tokenId = ?', [tokenId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted authToken with id: ', tokenId);
    result(null, res);
    return;
  });
};

// delete all authTokens
AuthToken.removeAll = result => {
  sql.query('DELETE FROM authToken', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s authTokens.', res.affectedRows);
    result(null, res);
    return;
  });
};

// Revoke a token
AuthToken.revokeById = (authTokenId, result) => {
  sql.query('UPDATE authToken SET revoked = 1, createdDateTime = ? WHERE tokenId = ?', [new Date(), authTokenId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('AuthToken revoked: ', { id: authTokenId });
    result(null, { id: authTokenId });
    return;
  });
};

// Get authToken by userId
AuthToken.getTokenByUserId = (userId, result) => {
  sql.query('SELECT * FROM authToken WHERE userId = ?', [userId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    } 

    if (res.length == 0) {
      if (debug) console.log('No token for user with id: ' + userId);
      result({ kind: 'not_found' }, null)
      return;
    } else {
      if (debug) console.log('Token found');
      console.log(res[0].refreshToken);
      result(null, res[0].refreshToken);
      return;
    }
  });
};

AuthToken.updateRefreshToken = (userId, currentToken, newToken, result) => {
  sql.query('UPDATE authToken SET refreshToken = REPLACE(refreshToken, ?, ?), createdDateTime = ? WHERE userId = ?', [currentToken, newToken, new Date(), userId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    } 

    console.log(res);

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    result(null, res);
    return;    
  })
}

module.exports = AuthToken;