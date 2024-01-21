const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, schemaId, createdDate, updatedDate, valueMap
    FROM entities LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(entity){
  const valuesString = JSON.stringify(entity.values);
  const result = await db.query(
    `SET @id = UUID();
    SET @time = UTC_TIMESTAMP();
    INSERT INTO entities 
      (id, schemaId, createdDate, updatedDate, valueMap) 
      VALUES 
      (@id, '${entity.schemaId}', @time, @time, '${valuesString}');
    SELECT @id;`
  );
  let message = 'Error in creating entity';
  let id = null;
  if (result[2].affectedRows) {
    message = 'Entity created successfully';
    id = result[3][0]['@id'];
  }
  return { message, id };
}

module.exports = {
  getMultiple,
  create
}