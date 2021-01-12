var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");

const dbConfig = require("../config/config");

Sequelize.Promise.config({
  // Enables all warnings except forgotten return statements.
  warnings: {
    wForgottenReturn: false
  }
});

var env = process.env.NODE_ENV || "development";
var config = dbConfig["development"];

// HACK: Override timezone formatting if working with MSSQL
if (config.dialect === "mssql") {__dirname;
  Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
    return date.format("YYYY-MM-DD HH:mm:ss.SSS");
  };
}

if (config.logging)
  config.logging = console.log;

config.pool = {
  max: 50,
  min: 0,
  idle: 5000,
  evict: 5000
};

var sequelize;
// Se houver variável de ambiente do Heroku ou produção...
if (process.env.DATABASE_URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
else
  sequelize = new Sequelize(config.database, config.username, config.password, config);

var db = {};

// Carrega arquivos de modelos das tabelas do módulo MMI
var modelFiles = fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "main.js" && file.slice(-3) === ".js";
  })
  .map(function (file) {
    return path.join(__dirname, file);
  });

modelFiles.forEach(function (file) {
  var model = sequelize.import(file);
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName])
    db[modelName].associate(db);
});

db.db = sequelize;
db.Op = Sequelize.Op;
module.exports = db;
