import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Cliente from '../app/models/Cliente';
import Estabelecimento from '../app/models/Estabelecimento';
import EstabelecimentoEndereco from '../app/models/EstabelecimentoEndereco';
import Recompensa from '../app/models/Recompensa';
import Movimentacao from '../app/models/Movimentacao';

const models = [Cliente, Estabelecimento, EstabelecimentoEndereco, Recompensa, Movimentacao];

class Database {
    constructor() {
        this.init();
    }

    init() {
        if (process.env.DATABASE_URL) {
            this.connection = new Sequelize(process.env.DATABASE_URL, {
                logging:  true,
                define: {
                    timestamps: true,
                    underscored: true,
                    underscoredAll: true,
                }
            });
        }
        else {
            this.connection = new Sequelize(databaseConfig.development);
        }
        
        
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();
