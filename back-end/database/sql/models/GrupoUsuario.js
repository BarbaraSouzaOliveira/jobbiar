"use strict";

module.exports = (sequelize, DataTypes) => {
  var GrupoUsuario = sequelize.define("GrupoUsuario", {
    id_grupo_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    },
  }, {
    tableName: "GrupoUsuario",
    timestamps: true
  });


  GrupoUsuario.associate = (models) => {
    GrupoUsuario.hasMany(models.Usuario, {
      foreignKey: "id_grupo_usuario",
      as: "usuarios"
    });
    
    GrupoUsuario.belongsToMany(models.Permissao, {
      as: "permissoes",
      through: models.GrupoUsuarioPermissao,
      foreignKey: "id_grupo_usuario"
    });
  };

  return GrupoUsuario;
};
