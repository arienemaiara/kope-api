import Sequelize, { Model } from 'sequelize';

class Recompensa extends Model {
    static init(sequelize) {
        super.init(
            {
                descricao: Sequelize.STRING,
                qtd_pontos: Sequelize.INTEGER,
                imagem_nome: Sequelize.STRING,
                imagem_path: Sequelize.STRING,
                // // imagem_url: {
                // //     type: Sequelize.VIRTUAL,
                // //     get() {
                // //         return `${process.env.API_URL}/files/${this.imagem_path}`;
                // //     },
                // // },
            },
            {
                sequelize
            }
        );

        this.addHook('beforeSave', async (recompensa) => {
            if (process.env.NODE_ENV !== 'production' && recompensa.imagem_path) {
                recompensa.imagem_path = `${process.env.API_URL}/files/${recompensa.imagem_path}`;
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Estabelecimento, { foreignKey: 'estabelecimento_id', as: 'estabelecimento' });
    }
}

export default Recompensa;