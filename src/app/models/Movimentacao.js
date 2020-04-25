import Sequelize, { Model } from 'sequelize';
import moment from 'moment';

class Movimentacao extends Model {
    static init(sequelize) {
        super.init(
            {
                qtd_pontos: Sequelize.INTEGER,
                acumulo: Sequelize.BOOLEAN,
                created_at: {
                    type: Sequelize.DATE,
                    get() {
                        return moment(this.getDataValue('created_at')).format('DD/MM/YYYY HH:mm');
                    },
                }
            },
            {
                tableName: 'movimentacoes',
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }

    static getSomaPontos(cliente_id, estabelecimento_id) {
        return this.sum('qtd_pontos', {
            where: {
                cliente_id,
                estabelecimento_id
            }
        })
    }

    // get created_at() {
    //     return moment(this.created_at).utcOffset('-03:00');
    // }
}

export default Movimentacao;