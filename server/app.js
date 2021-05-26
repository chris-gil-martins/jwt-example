const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public/index.html')));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app;
