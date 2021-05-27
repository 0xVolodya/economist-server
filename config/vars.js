// import .env variables
require('dotenv')
  .config({ silent: true });

const localMongo = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI;

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.NODE_ENV === 'test' ? '3001' : process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongo: {
    uri: process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : localMongo
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
