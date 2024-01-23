const express = require('express');
const router = express.Router();
const entities = require('../services/entities');

router.get('/', async function(req, res, next) {
  try {
    const dbRequest = req.query.schemaId ? entities.getMultipleBySchema(req.query.schemaId, req.query.page) : entities.getMultiple(req.query.page); 
    res.json(await dbRequest);
  } catch (err) {
    console.error(`Error while getting entities: `, err.message);
    next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await entities.getById(req.params.id));
  } catch (err) {
    console.error(`Error while getting entity: `, err.message);
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