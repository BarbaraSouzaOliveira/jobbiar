"use strict";

module.exports = (sequelize, DataTypes) => {
  var Permissao = sequelize.define("Permissao", {
    id_permissao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(280),
      allowNull: true,
    },
    invisivel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: "Permissao",
    timestamps: true
  });

  Permissao.associate = (models) => {
    Permissao.belongsToMany(models.GrupoUsuario, {
      as: "gruposUsuarios",
      through: models.GrupoUsuarioPermissao,
      foreignKey: "id_permissao"
    });
  };

  return Permissao;
};
