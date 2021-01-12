"use strict";

const models = require("../database/sql/models/main");

exports.list = async (req, res, callback) => {
  try {
    let result = await models.Permissao.findAll({
      attributes: ["id_permissao", "label", "nome", "descricao"],
      where: {
        invisivel: false,
      },
    });

    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao listar dados no banco de dados",
      error: e
    }, 500);
  }
};
