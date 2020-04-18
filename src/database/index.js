import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Cliente from '../app/models/Cliente';
import Estabelecimento from '../app/models/Estabelecimento';

const models = [Cliente, Estabelecimento];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        
        models.map((model) => model.init(this.connection));
    }
}

export default new Database;
