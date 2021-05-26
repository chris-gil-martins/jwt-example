const router = require('express').Router();
const { isOwner } = require('../utils/middleware');

router.get('/:userId', isOwner, (req, res, next) => {
  res.send({ secret: 42 + parseInt(req.params.userId) });
});

module.exports = router;
