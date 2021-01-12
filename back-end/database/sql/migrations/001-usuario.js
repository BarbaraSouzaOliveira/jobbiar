const { DataTypes } = require("sequelize");

module.exports = {
  /**
     * @param {import('sequelize').QueryInterface} queryInterface
     */
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable("GrupoUsuario", {
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
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      }, { transaction });

      await queryInterface.addConstraint("GrupoUsuario", {
        fields: ["nome"],
        type: "unique",
        name: "uq_grupo_usuario_nome",
        transaction,
      });


      await queryInterface.createTable("Permissao", {
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
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      }, { transaction });

      await queryInterface.addConstraint("Permissao", {
        fields: ["label"],
        type: "unique",
        name: "uq_permissao_label",
        transaction,
      });

      await queryInterface.addConstraint("Permissao", {
        fields: ["nome"],
        type: "unique",
        name: "uq_permissao_nome",
        transaction,
      });


      await queryInterface.createTable("GrupoUsuarioPermissao", {
        id_grupo_usuario_permissao: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        id_grupo_usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_permissao: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
      }, { transaction });

      await queryInterface.addConstraint("GrupoUsuarioPermissao", {
        fields: ["id_grupo_usuario", "id_permissao"],
        type: "unique",
        name: "uq_grupo_usuario_permissao_composta",
        transaction,
      });

      await queryInterface.addConstraint("GrupoUsuarioPermissao", {
        fields: ["id_grupo_usuario"],
        type: "foreign key",
        name: "fk_grupo_usuario_permissao_id_grupo_usuario",
        references: {
          table: "GrupoUsuario",
          field: "id_grupo_usuario",
        },
        onDelete: "cascade",
        transaction,
      });

      await queryInterface.addConstraint("GrupoUsuarioPermissao", {
        fields: ["id_permissao"],
        type: "foreign key",
        name: "fk_grupo_usuario_permissao_id_permissao",
        references: {
          table: "Permissao",
          field: "id_permissao",
        },
        onDelete: "cascade",
        transaction,
      });


      await queryInterface.createTable("Usuario", {
        id_usuario: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        id_grupo_usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        nome: {
          type: DataTypes.STRING(140),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
        senha: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        ultimo_login: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      }, { transaction });

      await queryInterface.addConstraint("Usuario", {
        fields: ["email"],
        type: "unique",
        name: "uq_usuario_email",
        transaction,
      });

      await queryInterface.addConstraint("Usuario", {
        fields: ["id_grupo_usuario"],
        type: "foreign key",
        name: "fk_usuario_id_grupo_usuario",
        references: {
          table: "GrupoUsuario",
          field: "id_grupo_usuario",
        },
        transaction,
      });


      await queryInterface.bulkInsert("GrupoUsuario", [
        {
          id_grupo_usuario: 1,
          nome: "Super",
        },
        {
          id_grupo_usuario: 2,
          nome: "Administrador",
        }
      ], { transaction });

      await queryInterface.bulkInsert("Permissao", [
        {
          id_permissao: 1,
          label: "r_visualizar",
          nome: "Visualização de informações",
          descricao: "Pode visualizar o dashboard e gerar e acessar os relatórios",
        }, {
          id_permissao: 2,
          label: "rw_usuario",
          nome: "Edição de usuário",
          descricao: "Pode editar/incluir/excluir todos os campos na tela de usuário",
        }, 
        {
          id_permissao: 3,
          label: "rw_colaborador",
          nome: "Edição de registros de colaboradores",
          descricao: "Pode editar/incluir/excluir registro de colaboradores",
        }
      ], { transaction });

      await queryInterface.bulkInsert("GrupoUsuarioPermissao", [
        {
          id_grupo_usuario: 1,
          id_permissao: 1,
        },
        {
          id_grupo_usuario: 1,
          id_permissao: 2,
        },
        {
          id_grupo_usuario: 1,
          id_permissao: 3,
        },
        {
          id_grupo_usuario: 2,
          id_permissao: 1,
        },
      ], { transaction });
      await queryInterface.bulkInsert("Usuario", [{
        id_usuario: 1,
        nome: "Administrador",
        email: "admin@localhost",
        senha: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
        id_grupo_usuario: 1,
      }], { transaction });


      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  /**
     * @param {import('sequelize').QueryInterface} queryInterface
     */
  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable("GrupoUsuarioPermissao", { transaction });
      await queryInterface.dropTable("Usuario", { transaction });
      await queryInterface.dropTable("Permissao", { transaction });
      await queryInterface.dropTable("GrupoUsuario", { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
