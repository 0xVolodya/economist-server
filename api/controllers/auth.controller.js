const httpStatus = require('http-status');
const User = require('../models/user.model');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, access_token) {
  return {
    access_token,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = req.body;
    userData.ip = req.ip;
    const user = await new User(userData).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({
      token,
      user: userTransformed,
    });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const {
      user,
      access_token,
    } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, access_token);
    const userTransformed = user.transform();
    return res.json({
      token,
      user: userTransformed,
    });
  } catch (error) {
    return next(error);
  }
};
