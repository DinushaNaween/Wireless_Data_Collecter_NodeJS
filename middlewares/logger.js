const winston = require('winston');

timeStamp = () => {
  return new Date(Date.now()).toUTCString();
}

class Logger {
  constructor(route) {
    this.route = route
    this.req_data = null
    this.ip_address = null
    this.user = null

    const logger = winston.createLogger({
      transports: [
        // new winston.transports.Console(),
        new winston.transports.File({
          filename: `./logs/${route}/${route}.log`,
          handleExceptions: true,
          maxsize: 5242880,
          maxFiles: 5
        })
      ],
      format: winston.format.printf((info) => {
        let message = `${timeStamp()} | ${info.level.toUpperCase()} | ${route} | ${info.message} | `
        message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
        message = this.req_data ? message + `req_header:${JSON.stringify(this.req_data)} | ` : message
        return message
      })
    });

    if (debug) {
      logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }

    this.logger = logger;
  };

  setReqData(req) {

    let data = `{ 
                  "ip": "${req.connection.remoteAddress}",
                  "host": "${req.headers.host}",
                  "path": "${req.originalUrl}",
                  "method": "${req.method}"
                }`

    this.req_data = JSON.parse(data);
  };

  async info(message) {
    this.logger.log('info', message);
  };

  async info(message, obj) {
    this.logger.log('info', message, {
      obj
    });
  };

  async debug(message) {
    this.logger.log('debug', message);
  };

  async debug(message, obj) {
    this.logger.log('debug', message, {
      obj
    });
  };

  async error(message) {
    this.logger.log('error', message);
  };

  async error(message, obj) {
    this.logger.log('error', message, {
      obj
    });
  };
};

module.exports = Logger;