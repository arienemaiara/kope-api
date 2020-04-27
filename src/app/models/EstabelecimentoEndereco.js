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

        // // this.addHook('beforeSave', async (endereco) => {
        // //     const res = await GeocodeService.geocodificarEndereco(endereco);
        // //     console.log('res', res)
        // //     // if (res.latitude && res.longitude) {
        // //     //     endereco.coordenadas = { type: 'Point', coordinates: [res.latitude,res.typelongitude]};
        // //     // }
        // // });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }
}

export default EstabelecimentoEndereco;