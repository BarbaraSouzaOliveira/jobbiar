const mongo = require("../database/mongo/mongo");
const { methodsToAudit, areasToAudit } = require("../resources/audit");

const getCurrentMethodFromList = (requestMethod) => {
  let methodFilter = methodsToAudit.filter(el => el.method == requestMethod);
  return (methodFilter.length == 1) ? methodFilter[0] : null;
};

const getCurrentAreaFromList = (baseURL, originalURL) => {
  let areaFilter = areasToAudit.filter(el => el.baseURL == baseURL);
  let areaObject = (areaFilter.length == 1) ? areaFilter[0] : null;
  
  if (Array.isArray(areaObject.area)) {
    areaFilter = areaObject.area.filter(el => el.originalURL == originalURL);
    areaObject = (areaFilter.length == 1) ? areaFilter[0] : null;
  }
  return areaObject;
};

const auditMiddleware = async (req, res, next) => {
  const requestMethod = req.method;
  const currentMethod = getCurrentMethodFromList(requestMethod);

  if (currentMethod) {
    let areaObject = getCurrentAreaFromList(req.baseUrl, req.originalUrl);

    let auditData = {
      date: new Date(),
      user_id: req.usuario.id_usuario,
      user_name: req.usuario.nome,
      baseURL: req.baseUrl,
      originalURL: req.originalUrl,
      area: areaObject ? areaObject.area : "ÁREA NÃO IDENTIFICADA",
      action: currentMethod.description,
      json: req.body
    };

    let newAuditRecord = new mongo.AuditRecords(auditData);

    await newAuditRecord.save();
  }

  next();
};

module.exports = {
  auditMiddleware
};
