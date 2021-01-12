"use strict";

const models = require("../database/sql/models/main");
const coreAuth = require("../common/coreAuth");

const recordsByPage = 20;

exports.auth = async (req, res, callback) => {
  try {
    let { email, senha } = req.body;

    const result = await models.Usuario.findAll({
      attributes: ["id_usuario", "email", "nome"],      
      include: [{
        association: "grupoUsuario",
        attributes: ["nome", "descricao"],
        where: { deletedAt: null },
        include: [{
          association: "permissoes",
          attributes: ["label"],
          through: {
            attributes: [],
          }
        }]
      }],

      where: {
        email,
        senha: coreAuth.hashPassword(senha),
        ativo: true,
        deletedAt: null,
      },
    });

    if (result.length > 0) {
      const usuario = {
        id_usuario: result[0].id_usuario,
        email: result[0].email,
        nome: result[0].nome,
        permissoes: result[0].grupoUsuario.permissoes.map(p => p.label),
      };

      let token = await coreAuth.signToken(usuario);

      usuario.grupo = result[0].grupoUsuario.nome,
      usuario.descricao = result[0].grupoUsuario.descricao;

      callback(null, 200, {
        usuario,
        token,
      });

      await models.Usuario.update({
        ultimo_login: new Date()
      }, {
        where: { id_usuario: result[0].id_usuario }
      });

    } else {
      callback({
        errorMessage: "Usuário ou senha inválidos ou usuário inativo no sistema."
      }, 200);
    }
  } catch (e) {
    console.log(e);
    callback({
      errorMessage: "Falha desconhecida ao tentar autenticar"
    }, 500);
  }
};

exports.getIfUserHasPermission = async (req, res, callback) => {
  try {
    let { email, password, permission } = req.body;

    let result = await models.Usuario.findOne({
      attributes: ["id_usuario", "email", "nome"],      
      include: [{
        association: "grupoUsuario",
        attributes: ["nome", "descricao"],
        where: { deletedAt: null },
        include: [{
          association: "permissoes",
          attributes: ["label"],
          where: {
            label: permission
          },
          through: {
            attributes: [],
          }
        }]
      }],

      where: {
        email,
        senha: coreAuth.hashPassword(password),
        ativo: true,
        deletedAt: null,
      },
    });

    callback(null, 200, result? [result] : []);
  } catch (e) {
    console.log(e);
    callback({
      errorMessage: "Falha desconhecida ao tentar autenticar"
    }, 500);
  }
};

exports.checkIfEmailExistis = async (req, res, callback) => {
  try {
    const result = await models.Usuario.findAll({
      where: {
        email: req.params.email,
        deletedAt: null,
      },
      attributes: ["id_usuario"],
    });

    callback(null, 200, {
      existe: (result.length > 0),
    });

  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.create = async (req, res, callback) => {
  try {
    let values = {
      email: req.body.email,
      nome: req.body.nome,
      senha: coreAuth.hashPassword(req.body.senha),
      ativo: req.body.ativo,
      id_grupo_usuario: req.body.id_grupo_usuario,
    };

    let result = await models.Usuario.create(values);
    callback(null, 200, {
      id_usuario: result.id_usuario,
      email: result.email,
      nome: result.nome,
      ativo: result.ativo,
      id_grupo_usuario: result.id_grupo_usuario,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt,
    });
  } catch (e) {
    callback({
      errorMessage: "Falha ao inserir dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.list = async (req, res, callback) => {
  try {
    let page = +(req.query.page || 1);
    let limit = +(req.query.rowsPerPage==20 ? recordsByPage : req.query.rowsPerPage);
    let offset = limit * (page - 1);
    let result = null;

    let params = {
      attributes: ["id_usuario", "nome", "email", "ativo", "ultimo_login"],
      include: [{
        association: "grupoUsuario",
        attributes: ["nome"],
        where: {
          invisivel: false
        }
      }],
      where: {
        deletedAt: null,
      },
      order: ["nome"]
    };

    if (req.query.withoutPaging !== "true") {
      params.offset = offset;
      params.limit = limit;

      result = await models.Usuario.findAndCountAll(params);
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await models.Usuario.findAll(params);
    }


    if (req.query.withoutPaging !== "true") {
      result.rows = result.rows.map(u => ({
        id_usuario: u.id_usuario,
        nome: u.nome,
        email: u.email,
        ativo: u.ativo,
        ultimo_login: u.ultimo_login,
        grupo: u.grupoUsuario.nome,
      }));
    } else {
      result = result.map(u => ({
        id_usuario: u.id_usuario,
        nome: u.nome,
        email: u.email,
        ativo: u.ativo,
        ultimo_login: u.ultimo_login,
        grupo: u.grupoUsuario.nome,
      }));
    }
    
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
    let result = await models.Usuario.findByPk(req.params.id, { deletedAt: null});

    callback(null, 200, {
      id_usuario: result.id_usuario,
      nome: result.nome,
      email: result.email,
      ativo: result.ativo,
      ultimo_login: result.ultimo_login,
      id_grupo_usuario: result.id_grupo_usuario,
    });
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
      email: req.body.email,
      nome: req.body.nome,
      id_grupo_usuario: req.body.id_grupo_usuario,
    };

    if (req.usuario.id_usuario !== +req.params.id) {
      // o próprio usuário não pode mudar sua ativação
      values.ativo = req.body.ativo;
    }
    if (req.body.senha) { // se senha enviada, atualiza ela no banco
      values.senha = coreAuth.hashPassword(req.body.senha);
    }

    let result = await models.Usuario.update(values, {where: { id_usuario: req.params.id }});
    delete result.senha;

    callback(null, 200, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.toggleActive = async (req, res, callback) => {
  try {
    if (req.usuario.id_usuario === +req.params.id) {
      // não deixa mudar a ativação do próprio usuário
      return callback({
        errorMessage: "Não é possível ativar ou desativar o próprio usuário"
      }, 400);
    }
    let values = {
      ativo: req.body.ativo,
    };

    await models.Usuario.update(values, { where:{ id_usuario: req.params.id } });

    callback(null, 200, { ativo: req.body.ativo });
  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};

exports.delete = async (req, res, callback) => {
  try {
    if (req.usuario.id_usuario === req.params.id) {
      return callback({
        errorMessage: "Não é possível apagar o próprio usuário"
      }, 400);
    }
  

    let result = await models.Usuario.update({
      deletedAt: new Date()
    }, {
      where: { id_usuario: req.params.id }
    });

    callback(null, 204, result);
  } catch (e) {
    callback({
      errorMessage: "Falha ao recuperar dados no banco de dados",
      error: e
    }, 500);
  }
};
