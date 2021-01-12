const Joi = require("joi");
const { id, date, boolean } = require("./validetors");

module.exports = Joi.object({
  id_permissao: id,
  label: Joi.string().min(1).max(50),
  nome: Joi.string().min(3).max(100),
  descricao: Joi.string().min(10).max(280),
  invisivel: boolean,
  createdAt: date,
  updatedAt: date,
  deletedAt: date
});