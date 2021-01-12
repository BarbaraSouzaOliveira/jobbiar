"use strict";

const express = require("express");
const controllers = require("../../../controllers");
const usuarioController = require("../../../controllers/usuario");

const router = express.Router();

const auth = require("../../../common/coreAuth");

router.post("/", async (req, res) => {
  controllers.execute(req, res, await usuarioController.auth);
});

router.get("/gen204", auth.authMiddleware(auth.getValidationFn([])), (req, res) => {
  res.status(204).end();
});

module.exports = router;
