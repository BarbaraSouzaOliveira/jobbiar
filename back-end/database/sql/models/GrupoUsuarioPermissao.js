"use strict";

module.exports = (sequelize, DataTypes) => {
  var GrupoUsuarioPermissao = sequelize.define("GrupoUsuarioPermissao", {
    id_grupo_usuario_permissao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_grupo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_permissao: {
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
  }, {
    tableName: "GrupoUsuarioPermissao",
    timestamps: true
  });

  GrupoUsuarioPermissao.associate = (models) => {
    GrupoUsuarioPermissao.belongsTo(models.GrupoUsuario, {
      foreignKey: "id_grupo_usuario"
    });
    
    GrupoUsuarioPermissao.belongsTo(models.Permissao, {
      foreignKey: "id_permissao"
    });
  };

  return GrupoUsuarioPermissao;
};
