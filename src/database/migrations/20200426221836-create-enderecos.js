'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('estabelecimento_enderecos', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
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
        coordenadas: {
          type: Sequelize.GEOMETRY('POINT', 4326),
          allowNull: true,
        },
        endereco: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        cep: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        numero: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        complemento: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        bairro: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        cidade: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        estado: {
          type: Sequelize.STRING,
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

  down: (queryInterface) => {
    return queryInterface.dropTable('estabelecimento_enderecos');
  }
};
