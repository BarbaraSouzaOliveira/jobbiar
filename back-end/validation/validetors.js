const Joi = require("joi");

module.exports = {
  id: Joi.number().positive().integer(),
  ids: Joi.array().items(Joi.number().positive().integer().allow(null)),
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  // Valida um password com pelo menos 8 caracteres, 
  // um número e uma letra maiúscula (max 30 caracteres)
  strongPassword: Joi.string().pattern(
    new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}")
  ),
  email: Joi.string().email(),
  img: Joi.string().dataUri(),
  boolean: Joi.boolean(),
  date: Joi.date()
};