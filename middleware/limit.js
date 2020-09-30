const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 2,
});
