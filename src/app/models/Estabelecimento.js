import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Estabelecimento extends Model {
    static init(sequelize) {
        super.init({
            cpf_cnpj: Sequelize.STRING,
            nome: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            telefone: Sequelize.STRING,
            avatar_nome: Sequelize.STRING,
            avatar_path: Sequelize.STRING,
            avatar_url: {
                type: Sequelize.VIRTUAL,
                get() {
                    return `${process.env.API_URL}/files/${this.avatar_path}`;
                },
            },
        }, {
            sequelize
        });

        this.addHook('beforeSave', async (estabelecimento) => {
            if (estabelecimento.password) {
                estabelecimento.password_hash = await bcrypt.hash(estabelecimento.password, 8);
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default Estabelecimento;