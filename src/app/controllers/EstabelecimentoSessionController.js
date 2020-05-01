import jwt from 'jsonwebtoken';

import Estabelecimento from '../models/Estabelecimento';

import authConfig from '../../config/auth';

class EstabelecimentoSessionController {
    async store(req, res) {
        const { cpf_cnpj, password } = req.body;

        const estabelecimento = await Estabelecimento.findOne({ where: { cpf_cnpj } });

        if (!estabelecimento) {
            return res.status(401).json({ error: 'Estabelecimento não encontrado.' });
        }

        if (!(await estabelecimento.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        const { id, nome } = estabelecimento;

        return res.json({
            user: {
                id,
                cpf_cnpj,
                nome,
            },
            token: jwt.sign({ id, tipoUsuario: 'estabelecimento' }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new EstabelecimentoSessionController();