"use strict";

const express = require("express");
const controllers = require("../../../controllers");
const permissaoController = require("../../../controllers/permissao");

const router = express.Router();

router.get("/", async (req, res) => {
  controllers.execute(req, res, await permissaoController.list);
});

module.exports = router;
