const { User } = require('../db');
const ExpressError = require('./error');

const isLoggedIn = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next(new ExpressError(401, 'unauthorized'));
  }

  try {
    const [signature, token] = authorization.split(' ');
    if (signature === 'Bearer') {
      const user = await User.findByToken(token, true);
      req.user = user;
      next();
    } else {
      next(new ExpressError(401, 'unauthorized'));
    }
  } catch (error) {
    next(new ExpressError(401, 'unauthorized'));
  }
};

const isOwner = async (req, res, next) => {
  if (req.user.id === parseInt(req.params.userId)) {
    next();
  } else {
    next(new ExpressError(403, 'forbidden'));
  }
};

module.exports = { isLoggedIn, isOwner };
