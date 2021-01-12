"use strict";

const express = require("express");
const controllers = require("../../../controllers");
const grupoUsuarioController = require("../../../controllers/grupoUsuario");

const router = express.Router();

router.post("/", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.create);
});

router.put("/definePermissao", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.setPerm);
});

router.get("/", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.list);
});

router.get("/comPermissoes", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.listWithPerms);
});

router.get("/:id", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.retrieve);
});

router.put("/:id", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.update);
});

router.delete("/:id", async (req, res) => {
  controllers.execute(req, res, await grupoUsuarioController.delete);
});

module.exports = router;
