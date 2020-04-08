import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Cliente extends Model {
    static init(sequelize) {
        super.init({
            cpf: Sequelize.STRING,
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

        this.addHook('beforeSave', async (cliente) => {
            if (cliente.password) {
                cliente.password_hash = await bcrypt.hash(cliente.password, 8);
            }
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default Cliente;
