const Joi = require("joi");
const { boolean, id, date} = require("./validetors")

module.exports = {
  paginationScheme: Joi.object({
    nome: Joi.string(),
    page: Joi.number().integer().default(1),
    rowsPerPage: Joi.number().integer().default(20),
    withoutPaging: boolean.default(true),
    t: date,
  }),
  idSchema: Joi.object({
    id: id
  })
};