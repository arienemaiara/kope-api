import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Cliente from '../app/models/Cliente';
import Estabelecimento from '../app/models/Estabelecimento';
import Recompensa from '../app/models/Recompensa';
import Movimentacao from '../app/models/Movimentacao';

const models = [Cliente, Estabelecimento, Recompensa, Movimentacao];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }
}

export default new Database;
