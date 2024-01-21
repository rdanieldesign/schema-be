function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function formatBooleanProperties(obj, ...props) {
  props.forEach((prop) => {
    obj[prop] = getBoolFromNum(obj[prop]);
  });
  return obj;
}

function getNumFromBoolean(bool) {
  return bool ? 1 : 0;
}

function getBoolFromNum(num) {
  return num === 1 ? true : false;
}

function getStringOrNull(value) {
  return value ? `'${value}'` : null;
}

module.exports = {
  getOffset,
  emptyOrRows,
  getNumFromBoolean,
  getBoolFromNum,
  formatBooleanProperties,
  getStringOrNull
}