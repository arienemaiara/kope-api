import Sequelize, { Model } from 'sequelize';

class Movimentacao extends Model {
    static init(sequelize) {
        super.init(
            {
                qtd_pontos: Sequelize.INTEGER,
                acumulo: Sequelize.BOOLEAN,
                created_at: Sequelize.DATE
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
}

export default Movimentacao;