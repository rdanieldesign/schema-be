const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT attributeId, schemaId, primary, secondary
    FROM schemaAttributes LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

function getAddAttributeToSchemaQuery(attributeId, schemaId, isPrimary = false, isSecondary = false){
  return `INSERT INTO schemaAttributes 
      (attributeId, schemaId, isPrimary, isSecondary)
      VALUES
      ('${attributeId}', '${schemaId}', ${helper.getNumFromBoolean(isPrimary)}, ${helper.getNumFromBoolean(isSecondary)});`
}

async function addAttributeToSchema(attributeId, schemaId, isPrimary = false, isSecondary = false){
  const result = await db.query(getAddAttributeToSchemaQuery(attributeId, schemaId, isPrimary, isSecondary));
  let message = 'Error in associating the attribute to the schema';
  if (result.affectedRows) {
    message = 'Attribute successfully associated with the schema';
  }
  return { message };
}

module.exports = {
  getMultiple,
  addAttributeToSchema,
  getAddAttributeToSchemaQuery
}