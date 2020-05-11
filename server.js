const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/global.config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Data Collector...' });
});

require('./routes/role.routes')(app);
require('./routes/privilege.routes')(app);
require('./routes/rolePrivilege.routes')(app);
require('./routes/user.routes')(app);
require('./routes/collection.routes')(app);

app.listen(8080, () => {
  console.log('Server is listning on port 8080.');
});