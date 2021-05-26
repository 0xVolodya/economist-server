const Joi = require('joi');

module.exports = {

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
    },
  },

};
