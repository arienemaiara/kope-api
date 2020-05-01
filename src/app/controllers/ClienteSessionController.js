import jwt from 'jsonwebtoken';

import Cliente from '../models/Cliente';

import authConfig from '../../config/auth';

class ClienteSessionController {
    async store(req, res) {
        const { cpf, password } = req.body;

        const cliente = await Cliente.findOne({ where: { cpf } });

        if (!cliente) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        if (!(await cliente.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        const { id, nome } = cliente;

        return res.json({
            user: {
                id,
                cpf,
                nome,
            },
            token: jwt.sign({ id, tipoUsuario: 'cliente' }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new ClienteSessionController();