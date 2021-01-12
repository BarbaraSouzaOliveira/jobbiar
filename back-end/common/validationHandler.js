const { ApiError } = require("../common/Api");
const { getFormatedStringDate } = require("./utils");

/**
 * @param {Object} value Valor a ser validado
 * @param {Joi.object} schema Joi object que representa os dados a serem validados
 * @param {string[]} requestedProps Propriedades que são obrigatorias no objeto
 */

async function validationHandler(value, schema, requestedProps, routeInfo) {
  const info = routeInfo ? routeInfo : "";
  let validatedData;

  if (requestedProps) {
    for (let prop of requestedProps) {
      if (value[prop] === undefined) {
        console.log(
          getFormatedStringDate(),
          info,
          "\x1b[31m" + "Validation Error:" + "\x1b[0m", 
          `${prop}" is required`
        );
        throw ApiError(400, `"${prop}" is required`);
      }
    }
  }

  try {
    validatedData = await schema.validateAsync(value);
  } catch (error) {
    console.log(
      getFormatedStringDate(),
      info,
      "\x1b[31m"+ "Validation Error:" + "\x1b[0m",
      error
    );
    throw ApiError(400, error.message);
  }

  return validatedData;
}

module.exports = {
  validateAsync: validationHandler
};