const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const schemaAttributes = require('./schema-attributes');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name, valueType, validationType, required, optionEntityId
    FROM attributes LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getPrimaryBySchemas(schemaIdQueryString){
  const schemaIds = schemaIdQueryString.split(',').map((id) => `'${id}'`).join(',');
  const rows = await db.query(
    `SELECT A.id, A.name, A.valueType, A.validationType, A.optionEntityId
    FROM attributes A
    INNER JOIN schemaAttributes SA ON A.id = SA.attributeId
    WHERE SA.schemaId IN (${schemaIds});`
  );
  return helper.emptyOrRows(rows);
}

async function create(attribute){
  const validationType = helper.getStringOrNull(attribute.validationType);
  const valueType = helper.getStringOrNull(attribute.valueType);
  const optionEntityId = helper.getStringOrNull(attribute.optionEntityId);
  const result = await db.query(
    `SET @id = UUID();
    INSERT INTO attributes 
      (id, name, valueType, validationType, required, optionEntityId) 
      VALUES 
      (@id, '${attribute.name}', ${valueType}, ${validationType}, ${attribute.required}, ${optionEntityId});
    SELECT @id;`
  );
  let message = 'Error in creating attribute';
  let id = null;
  if (result[1].affectedRows) {
    message = 'Attribute created successfully';
    id = result[2][0]['@id'];
  }
  if (id && attribute.schemaId) {
    const schemaAttributeResult = await db.query(schemaAttributes.getAddAttributeToSchemaQuery(id, attribute.schemaId, attribute.isPrimary, attribute.isSecondary));
    if (schemaAttributeResult.affectedRows) {
      message += ' and associated with the schema';
    } else {
      message += ' but failed to be associated with the schema';
    }
  }
  return { message, id };
}

module.exports = {
  getMultiple,
  getPrimaryBySchemas,
  create
}