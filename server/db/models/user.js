const Sequelize = require('sequelize');
const db = require('../db');
const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../../auth/tokens');
const ExpressError = require('../../utils/error');
const { verify } = require('jsonwebtoken');

const SALT_ROUNDS = 5;

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tokenVersion: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = User;

User.prototype.correctPassword = function (candidatePwd) {
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateAccessToken = function () {
  return createAccessToken(this.id);
};

User.prototype.generateRefreshToken = function () {
  return createRefreshToken(this.id, this.tokenVersion);
};

User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } });
  if (!user || !(await user.correctPassword(password))) {
    throw new ExpressError(401, 'Incorrect username/password');
  }
  return [user.generateAccessToken(), user.generateRefreshToken()];
};

User.findByToken = async function (token) {
  try {
    const { userId } = verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ExpressError(401, 'unauthorized');
    }
    return user;
  } catch (err) {
    throw new ExpressError(401, 'unauthorized');
  }
};

const hashPassword = async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
