"use strict";

const express = require("express");
const path = require("path");

const router = express.Router();

const { authMiddleware } = require("../middlewares");

router.use("/images", express.static(path.join(__dirname, "..", "..", "..", "images")));
router.use("/api/auth", require("./auth")); // rotas de autenticação
router.use("/api/usuario", authMiddleware("rw_usuario", "rw_usuario"), require("./usuario"));
router.use("/api/grupoUsuario", authMiddleware("rw_usuario", "rw_usuario"), require("./grupoUsuario"));
router.use("/api/permissao", authMiddleware("rw_usuario", "rw_usuario"), require("./permissao"));
// Handles invalid routes
router.all("*", require("./notFound"));

module.exports = router;
