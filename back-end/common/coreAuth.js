"use strict";

const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const { JWT_SIGNATURE_KEY } = require("../resources/constants");

/**
 * Gera um hash hecadecimal sha-2 256-bits de uma dada string
 * @param {string} str
 * @returns {string}
 */
const sha256 = str => crypto.createHash("sha256").update(str).digest("hex");

/**
 * Gera um sal de criptografia de 16 bytes aleatórios (equivalente à um uuid) e o retorna em base64
 * @returns {string}
 */
const salt = () => crypto.randomBytes(16).toString("base64").substr(0,22);

/**
 * pega um array de qualquer coisa e envolve cada elemento num array (a menos que ele já seja um)
 * @param {any[]} permissions array of any
 * @return {any[][]}
 */
const arrayfy = arr => arr.map(el => Array.isArray(el) ? el : [el]);

/**
 * Cria um token JWT assinado com o payload passado e validade de 1 hora
 * @param {object} payload objeto javascript
 * @returns {Promise<string>}
 */
const signToken = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SIGNATURE_KEY, {
      algorithm: "HS256",
      expiresIn: "10h",
      jwtid: salt(),
    }, (error, token) => {
      if (error) reject(error);
      else resolve(token);
    });
  });
};

/**
 * verifica a validade de um token JWT e, se válido, resolve no seu conteúdo
 * @param {string} token token JWT
 * @returns {Promise<object>}
 */
const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SIGNATURE_KEY, {
      algorithms: ["HS256"],
    }, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
};


/**
 * @callback ValidationFn
 * @param {string} token Token JWT
 * @returns {Promise<[boolean, object]>} [sucesso, payload]
 */

/**
 * Retorna uma função que retorna se um usuário possui dadas permissões ao receber um token JWT.
 *
 * - Se chamada com um booleano como parâmetro, retorna este booleano, independentemente de haver usuário logado.
 * - Se for chamada com um array vazio, retorna `true` caso haja um usuário logado.
 * - Se for chamada com uma string, retorna `true` caso haja um usuário logado e ele tenha tal permissão.
 * - Se for chamada com um array, retorna `true` caso o usuário possua todas as permissões de algum dos elementos deste array
 * (já que cada elemento pode ser uma string ou um array de strings)
 *
 * Em resumo, o array de permissões é tratado como um OR de permissões. Para fazer um AND, deve-se colocar um array de
 * permissões dentro deste array.
 * @param {boolean|string|(string|string[])[]} permissions
 * @returns {ValidationFn} função de validação de token JWT
 */
const getValidationFn = permissions => async token => {
  if (typeof permissions === undefined) return true;
  if (typeof permissions === "boolean") return permissions;
  let pPermissions = (typeof permissions === "string") ? [permissions] : permissions;
  let user;
  try {
    user = await verifyToken(token);
  } catch (error) {
    return [false, null];
  }
  if (!user.permissoes) return [false, user];
  if (pPermissions.length === 0) return [true, user];
  return [arrayfy(permissions).some(permissions => permissions.every(p => user.permissoes.includes(p))), user];
};

/**
 * Retorna um middleware de autenticação usando a função validadora de JWT passada por parâmetro.
 *
 * A função retornada popula `req` com um objeto do usuário caso a autenticação tenha sucesso,
 * retorna uma resposta com erro `401` caso o usuário não esteja autenticado ou uma resposta com
 * erro `403` caso o usuário não possua permissão suficiente.
 *
 * @param {ValidationFn} validationFn função de validação de token JWT
 * @returns {import('express').RequestHandler} middleware do express
 */
const authMiddleware = (mainValidationFn, readValidationFn = false) => async (req, res, next) => {
  let validationFn;
  let requestMethod = req.method;
  if (requestMethod === "GET" && readValidationFn){
    validationFn = readValidationFn;
  } else {
    validationFn = mainValidationFn;
  }

  let authorization = req.headers.authorization || "";
  let [type, token] = authorization.split(" ");

  if (!authorization && req.query.bearer) {
    type = "Bearer";
    token = req.query.bearer;
  }

  if (type === "Bearer") {
    let [temPermissao, usuario] = await validationFn(token);
    if (temPermissao) {
      req.usuario = usuario;
      return next();
    } else if (usuario) { // no permissions
      return res.status(403).json({ error: { errorMessage: "Forbidden", }});
    }
  }
  return res.status(401).header("WWW-Authenticate", "Bearer").json({ error: { errorMessage: "Unauthorized" }});
};

module.exports = {
  hashPassword: sha256,
  signToken,
  verifyToken,
  getValidationFn,
  authMiddleware,
};
