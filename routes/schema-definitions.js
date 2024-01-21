const express = require('express');
const router = express.Router();
const schemas = require('../services/schema-definitions');
const schemaAttributes = require('../services/schema-attributes');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await schemas.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting schemas: `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    res.json(await schemas.create(req.body.name));
  } catch (err) {
    console.error(`Error while creating schema: `, err.message);
    next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await schemas.getById(req.params.id));
  } catch (err) {
    console.error(`Error while getting schema: `, err.message);
    next(err);
  }
});

router.post('/:id/:attributeId', async function(req, res, next) {
  try {
    res.json(await schemaAttributes.addAttributeToSchema(req.params.attributeId, req.params.id, req.body.isPrimary, req.body.isSecondary));
  } catch (err) {
    console.error(`Error while creating schema: `, err.message);
    next(err);
  }
});

module.exports = router;