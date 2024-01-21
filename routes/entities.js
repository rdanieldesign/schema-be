const express = require('express');
const router = express.Router();
const entities = require('../services/entities');

router.get('/', async function(req, res, next) {
  try {
    res.json(await entities.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting entities: `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await entities.create(req.body));
  } catch (err) {
    console.error(`Error while creating entity: `, err.message);
    next(err);
  }
});

module.exports = router;