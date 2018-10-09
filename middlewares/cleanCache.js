const clearHash = require("../services/cache").clearHash;

module.exports = async (req, res, next) => {
  // run function after this middleware
  await next();

  clearHash(req.user.id);
};
