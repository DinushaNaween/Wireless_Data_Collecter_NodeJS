module.exports = app => {

  const unit = require('../controllers/unit.controller');

  // create new unit
  app.post('/unit', unit.create);

  // get all units
  app.get('/unit', unit.getAll);

  // find unit by id
  app.get('/unit/:unitId', unit.findById);

  // update unit by id
  app.put('/unit/:unitId', unit.update);

  // delete unit by id
  app.delete('/unit/:unitId', unit.remove);

  // delete all units
  app.delete('/unit', unit.removeAll);

  // disable a unit
  app.put('/unit/disable/:unitId', unit.disable);
}