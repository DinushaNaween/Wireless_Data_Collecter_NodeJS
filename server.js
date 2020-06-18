require('dotenv').config();
require('./config/global.config');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger.middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true
  })
)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Data Collector...' });
});

require('./routes/role.routes')(app); 
require('./routes/privilege.routes')(app);
require('./routes/rolePrivilege.routes')(app);
require('./routes/user.routes')(app);
require('./routes/collection.routes')(app);
require('./routes/unit.routes')(app);
require('./routes/parentNode.routes')(app);
require('./routes/node.routes')(app);
require('./routes/sensor.routes')(app);
require('./routes/dataTable.routes')(app);
require('./routes/table.routes')(app);

app.listen(8080, (err, result) => {
  if (err) {
    logger.error('error on starting server', err.message);
  } else {
    logger.info('server started listning on port 8080');
  }
}); 