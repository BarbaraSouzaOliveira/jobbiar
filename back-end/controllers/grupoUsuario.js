"use strict";

const models = require("../database/sql/models/main");

exports.create = async (req, res, callback) => {
  try {
    let values = {
      nome: req.body.nome,
      descricao: req.body.descricao,
    };

    let result = await models.GrupoUsuario.create(values);
    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao inserir dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.setPerm = async (req, res, callback) => {
  try {
    const { id_grupo_usuario, id_permissao, ativo } = req.body;

    if (ativo) {
      await models.GrupoUsuarioPermissao.findOrCreate({
        where: {
          id_grupo_usuario, id_permissao,
        },
        defaults: {
          id_grupo_usuario, id_permissao,
        },
      });
    } else {
      await models.GrupoUsuarioPermissao.destroy({
        where: {
          id_grupo_usuario,
          id_permissao,
        }
      });
    }

    callback(null, 200, { ativo });
  } catch (e) {
    callback({
      errorMessage: "Falha ao inserir dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.list = async (req, res, callback) => {
  try {
    let result = await models.GrupoUsuario.findAll({
      attributes: ["id_grupo_usuario", "nome", "descricao"],
      where: {
        deletedAt: null,
        invisivel: false,
      },
      raw: true,
    });

    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao listar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.listWithPerms = async (req, res, callback) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.rowsPerPage || 20;
    let offset = limit * (page - 1);

    let result = await models.GrupoUsuario.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id_grupo_usuario", "nome", "descricao"],
      where: {
        deletedAt: null,
        invisivel: false,
      },
      include: [{
        association: "permissoes",
        attributes: ["id_permissao", "label"],
        through: {
          attributes: [],
        },
      }]
    });

    result.pages = Math.ceil(result.count / limit);
    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao listar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.retrieve = async (req, res, callback) => {
  try {
    let result = await models.GrupoUsuario.findAll({
      where: {
        id_grupo_usuario: req.params.id,
        deletedAt: null,
        invisivel: false,
      },
      include: [{
        association: "permissoes",
        through: {
          attributes: []
        },
      }],
      limit: 1
    });

    callback(null, 200, result[0]);
  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.update = async (req, res, callback) => {
  try {
    let values = {
      nome: req.body.nome,
      descricao: req.body.descricao,
    };

    let result = await models.GrupoUsuario.update(values, {where: { id_grupo_usuario: req.params.id }});
    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao inserir dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.delete = async (req, res, callback) => {
  try {
    let result = await models.GrupoUsuario.update({
      deletedAt: new Date()
    }, {
      where: { id_grupo_usuario: req.params.id }
    });
    
    callback(null, 204, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};
