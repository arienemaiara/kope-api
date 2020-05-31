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
        this.connection = new Sequelize(process.env.DATABASE_URL || databaseConfig); //Heroku ou local
        
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }
}

export default new Database();
