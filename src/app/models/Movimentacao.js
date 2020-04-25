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
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }
}

export default Movimentacao;