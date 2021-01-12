const { getFormatedStringDate } = require("../../../common/utils");

module.exports = (req, res) => {
  const error = 
    getFormatedStringDate() +
    " \x1b[31m" + "Invalid route access: " + "\x1b[0m" +
    req.originalUrl;
  console.log(error);
  
  res.status(404).send({
    error: {
      errorMessage: "Invalid route access" + req.originalUrl,
    }
  });
};