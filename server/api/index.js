const router = require('express').Router();
const { isLoggedIn } = require('../utils/middleware');

router.use('/secrets', isLoggedIn, require('./secrets'));

module.exports = router;
