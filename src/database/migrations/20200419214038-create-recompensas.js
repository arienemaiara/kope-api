'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recompensas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      qtd_pontos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imagem_nome: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imagem_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estabelecimento_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'estabelecimentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('recompensas');
  }
};
