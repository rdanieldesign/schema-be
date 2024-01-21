const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, name 
    FROM schemaDefinitions LIMIT ${offset},${config.listPerPage};`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function getById(id){
  const results = await db.query(
    `SELECT S.id, S.name 
      FROM schemaDefinitions S
      WHERE S.id = '${id}';
    SELECT A.id, A.name, A.valueType, A.validationType, A.required, A.optionEntityId, SA.isPrimary, SA.isSecondary
      FROM schemaAttributes SA
      INNER JOIN attributes A ON A.id = SA.attributeId
      WHERE SA.schemaId = '${id}'
      ORDER BY SA.isPrimary DESC, SA.isSecondary DESC;`
  );
  return {...results[0][0], attributes: results[1].map((attribute) => {
    return { ...attribute, ...helper.formatBooleanProperties(attribute, 'isPrimary', 'isSecondary') }
  })};
}

async function create(name){
  const result = await db.query(
    `SET @id = UUID();
    INSERT INTO schemaDefinitions 
      (id, name) 
      VALUES 
      (@id, '${name}');
    SELECT @id;`
  );
  let message = 'Error in creating schema';
  let id = null;
  if (result[1].affectedRows) {
    message = 'Schema created successfully';
    id = result[2][0]['@id'];
  }
  return { message, id };
}

module.exports = {
  getMultiple,
  getById,
  create
}