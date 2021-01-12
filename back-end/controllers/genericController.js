const validationHandler = require("../common/validationHandler");

async function  genericController(data, schema, serviceFunction, requireds, routeInfo) {
  let validatedData;
  try {
    validatedData = await validationHandler.validateAsync(data, schema, requireds, routeInfo);
    return await serviceFunction(validatedData);
  } catch (apiError) {
    return apiError;
  }
}

module.exports = {
  genericController,
};