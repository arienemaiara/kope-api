import Sequelize, { Model } from 'sequelize';

import GeocodeService from '../services/GeocodeService';

class EstabelecimentoEndereco extends Model {
    static init(sequelize) {
        super.init(
            {
                coordenadas: Sequelize.GEOMETRY('POINT', 4326),
                endereco: Sequelize.STRING,
                cep: Sequelize.STRING,
                numero: Sequelize.STRING,
                complemento: Sequelize.STRING,
                bairro: Sequelize.STRING,
                cidade: Sequelize.STRING,
                estado: Sequelize.STRING,
            },
            {
                tableName: 'estabelecimento_enderecos',
                sequelize
            }
        );

        this.addHook('beforeSave', async (endereco) => {
            if (process.env.NODE_ENV !== 'test') {
                const pointLocation = await GeocodeService.geocodificarEndereco(endereco);
                endereco.coordenadas = pointLocation;
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }
}

export default EstabelecimentoEndereco;