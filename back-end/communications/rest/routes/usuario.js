"use strict";

const express = require("express");
const controllers = require("../../../controllers");
const usuarioController = require("../../../controllers/usuario");

const router = express.Router();

router.post("/", async (req, res) => {
  controllers.execute(req, res, await usuarioController.create);
});

router.get("/", async (req, res) => {
  controllers.execute(req, res, await usuarioController.list);
});

router.get("/email/:email", async (req, res) => {
  controllers.execute(req, res, await usuarioController.checkIfEmailExistis);
});

router.get("/:id", async (req, res) => {
  controllers.execute(req, res, await usuarioController.retrieve);
});

router.put("/:id", async (req, res) => {
  controllers.execute(req, res, await usuarioController.update);
});

router.put("/ativo/:id", async (req, res) => {
  controllers.execute(req, res, await usuarioController.toggleActive);
});

router.delete("/:id", async (req, res) => {
  controllers.execute(req, res, await usuarioController.delete);
});

router.post("/hasPermission", async (req, res) => {
  controllers.execute(req, res, await usuarioController.getIfUserHasPermission);
});

module.exports = router;
