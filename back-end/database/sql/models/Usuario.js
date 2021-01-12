"use strict";

module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define("Usuario", {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    ultimo_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_grupo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      allowNull: true
    },
  }, {
    tableName: "Usuario",
    timestamps: true
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.GrupoUsuario, {
      foreignKey: "id_grupo_usuario",
      as: "grupoUsuario"
    });
  };

  return Usuario;
};
