const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // max 5 submissions per IP per window
  message: 'Too many submissions, please try again later.',
});

module.exports = limiter