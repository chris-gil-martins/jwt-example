const router = require('express').Router();
const { User } = require('../db');
const { isLoggedIn } = require('../utils/middleware');
const { setRefreshToken, clearRefreshToken } = require('./tokens');
const { verify } = require('jsonwebtoken');
const ExpressError = require('../utils/error');

router.post('/login', async (req, res, next) => {
  try {
    const [accessToken, refreshToken] = await User.authenticate(req.body);
    setRefreshToken(res, refreshToken);
    res.send({ accessToken });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    setRefreshToken(res, refreshToken);
    res.send({ accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.post('/logout', (req, res, next) => {
  clearRefreshToken(res);
  res.sendStatus(200);
});

router.get('/me', isLoggedIn, async (req, res, next) => {
  res.send(req.user);
});

router.post('/refresh', async (req, res, next) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return next(new ExpressError(401, 'unauthorized'));
  }

  try {
    const payload = verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return next(new ExpressError(401, 'unauthorized'));
    }
    if (user.tokenVersion !== payload.tokenVersion) {  // outdated user
      return next(new ExpressError(401, 'unauthorized'));
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    setRefreshToken(res, refreshToken);
    res.send({ accessToken });
  } catch (error) {
    clearRefreshToken(res);
    return next(new ExpressError(401, 'unauthorized'));
  }
});

router.post('/clear', isLoggedIn, async (req, res, next) => {
  try {
    req.user.tokenVersion++;
    await req.user.save;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
