import Sequelize, { Model } from 'sequelize';

class Recompensa extends Model {
    static init(sequelize) {
        super.init(
            {
                descricao: Sequelize.STRING,
                qtd_pontos: Sequelize.INTEGER,
                imagem_nome: Sequelize.STRING,
                imagem_path: Sequelize.STRING,
                imagem_url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.API_URL}/files/${this.imagem_path}`;
                    },
                },
            },
            {
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }
}

export default Recompensa;