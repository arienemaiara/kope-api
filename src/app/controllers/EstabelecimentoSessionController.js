import jwt from 'jsonwebtoken';

import Estabelecimento from '../models/Estabelecimento';

import authConfig from '../../config/auth';

class EstabelecimentoSessionController {
    async store(req, res) {
        try {
            const { email, password } = req.body;

            const estabelecimento = await Estabelecimento.findOne({ where: { email } });

            if (!estabelecimento) {
                return res.status(401).json({ error: 'Estabelecimento não encontrado.' });
            }

            if (!(await estabelecimento.checkPassword(password))) {
                return res.status(401).json({ error: 'Senha inválida.' });
            }

            const { id, cpf_cnpj, nome, avatar_url } = estabelecimento;

            return res.json({
                user: {
                    id,
                    cpf_cnpj,
                    nome,
                    avatar_url
                },
                token: jwt.sign({ id, tipoUsuario: 'estabelecimento' }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }

    }
}

export default new EstabelecimentoSessionController();