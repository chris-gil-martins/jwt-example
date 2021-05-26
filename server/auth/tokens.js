const { sign } = require('jsonwebtoken');

const createAccessToken = (userId) => {
  return sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' });
  // return sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

const createRefreshToken = (userId, tokenVersion) => {
  return sign({ userId, tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: '45s' });
  // return sign({ userId, tokenVersion }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const setRefreshToken = (response, token) => {
  response.cookie('refresh_token', token, {
    httpOnly: true,
    path: '/auth/refresh',
    expires: new Date(Date.now() + 45 * 1000),
    // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

const clearRefreshToken = (response) => {
  response.clearCookie('refresh_token', {
    httpOnly: true,
    path: '/auth/refresh',
  });
};

module.exports = { createAccessToken, createRefreshToken, setRefreshToken, clearRefreshToken };
