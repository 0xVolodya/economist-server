// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const cron = require('node-cron');

const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const scrape = require('./scrape');

// open mongoose connection
mongoose.connect();

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

cron.schedule('0 */1 * * *', () => {
  scrape();
});

module.exports = app;
