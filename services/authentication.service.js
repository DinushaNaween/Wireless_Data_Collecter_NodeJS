const Role = require('../models/role.model');
const logger = require('../middlewares/logger.middleware');

exports.checkRole = (loggedUser, roleName, result) => {
  let userRoleId = loggedUser.roleId;

  Role.findById(userRoleId, (err, data) => {
    if (err) {
      logger.error('Role.findById', err.message);
      result(err, null);
      return;
    }

    if (data.roleName === roleName) {
      result(null, { state: 'matched' });
      return;
    } else {
      result(null, { state: 'not_matched' })
      return;
    }
  });
};