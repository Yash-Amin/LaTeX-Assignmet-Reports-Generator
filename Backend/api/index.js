const users = require('./users');
const practicals = require('./practicals');
const images = require('./image');
let router = require('express').Router();

router.use('/users', users);
router.use('/practicals', practicals);
router.use('/images', images);

module.exports = router;
