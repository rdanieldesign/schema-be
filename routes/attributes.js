const express = require('express');
const router = express.Router();
const attributes = require('../services/attributes');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await attributes.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting attributes `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await attributes.create(req.body));
  } catch (err) {
    console.error(`Error while creating attribute`, err.message);
    next(err);
  }
});

module.exports = router;