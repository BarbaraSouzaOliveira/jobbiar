const auth = require("../../common/coreAuth");

module.exports = {
  authMiddlewareAll: auth.authMiddleware(auth.getValidationFn([])),
  authMiddleware: (write, read) => auth.authMiddleware(auth.getValidationFn([write]), auth.getValidationFn([read])),
};
