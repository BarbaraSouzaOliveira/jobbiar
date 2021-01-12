"use strict";

module.exports = {
  methodsToAudit: [
    {
      method: "DELETE",
      description: "Exclusão de registro"
    }, {
      method: "POST",
      description: "Inclusão de registro"
    }, {
      method: "PUT",
      description: "Atualização de registro"
    }, {
      method: "PATCH",
      description: "Atualização de registro"
    }
  ],

  areasToAudit: [
    {
      baseURL: "/api/usuario",
      area: "USUÁRIO"
    }, {
      baseURL: "/api/grupoUsuario",
      area: "GRUPO DE USUÁRIO"
    }, {
      baseURL: "/api/permissao",
      area: "PERMISSÃO"
    }, {
      baseURL: "/api/unidade",
      area: "UNIDADE"
    }, {
      baseURL: "/api/material",
      area: "MATERIAL"
    }, {
      baseURL: "/api/registroEntrada",
      area: "ENTRADA DE MATERIAL CIRÚRGICA UNIDADE"
    }
  ]
};