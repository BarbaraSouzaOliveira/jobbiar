const models = require("../database/sql/models/main");
const { Op } = require("sequelize");
const { ApiResponse, ApiError } = require("../common/Api");

exports.create = async (model, data, errorMessage, parseFunc) => {
  try {
    let result = await models[model].create(data);
    if (parseFunc && result) {
      result = parseFunc(result);
    }
    return ApiResponse(201, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};

exports.createArray = async (model, values, errorMessage, parseFunc) => {
  try {
    let result = await models[model].bulkCreate(values);
    
    if(parseFunc && result) {
      result = parseFunc(result);
    }
    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};

exports.retrieveOne = async (model, where, errorMessage, parseFunc) => {
  try {
    let result = await models[model].findOne({
      attributes:{
        exclude: ["deletedAt", "updatedAt", "createdAt"]
      },
      where
    });

    if (parseFunc && result) {
      result = parseFunc(result);
    }

    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};

exports.retrieveAll = async(model, where, errorMessage, parseFunc) => {
  try {
    let result = await models[model].findAll({
      attributes:{
        exclude: ["deletedAt", "updatedAt", "createdAt"]
      },
      where
    });

    if (parseFunc && result) {
      result = parseFunc(result);
    }

    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};

exports.update = async (model, data, where, errorMessage, parseFunc) => {
  try {
    let result = await models[model].update(data, { where });
    if (parseFunc && result) {
      result = parseFunc(result);
    }
    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};

exports.delete = async (model, where, erroMessage, parseFunc) => {
  try {
    let result = await models[model].update({
      deletedAt: new Date()
    }, {
      where
    });

    if (parseFunc && result) {
      result = parseFunc(result);
    }
    
    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, erroMessage);
  }
};

exports.list = async (model, paginationQuery, rowMap, config, errorMessage, parseFunc) => {
  try {
    let page = paginationQuery.page;
    let limit = paginationQuery.rowsPerPage;
    let offset = limit * (page - 1);
    let result = null;
    let where = {
      deletedAt: null
    };

    if (paginationQuery.nome) {
      where.nome = { [Op.iLike]: `%${paginationQuery.nome}%` };
    }

    let params = {
      where,
      attributes: {
        exclude: ["deletedAt", "updatedAt", "createdAt"]
      },
      order: config.order,
      include: config.include
    };

    if (paginationQuery.withoutPaging !== true) {
      params.offset = offset;
      params.limit = limit;

      result = await models[model].findAndCountAll(params);
      result.pages = Math.ceil(result.count / limit);
      result.rows = result.rows.map(rowMap);
    } else {
      result = await models[model].findAll(params);
      result = result.map(rowMap);
    }

    if (parseFunc && result){
      result = parseFunc(result);
    }
    return ApiResponse(200, result);
  } catch (error) {
    console.log(error);
    return ApiError(500, errorMessage);
  }
};


