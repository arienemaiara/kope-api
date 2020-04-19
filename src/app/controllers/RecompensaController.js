import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recompensa from '../models/Recompensa';

class RecompensaController {
    async index(req, res) {
        try {
            const { page = 1, estabelecimento_id } = req.query;

            const recompensas = await Recompensa.findAll({
                where: {
                    estabelecimento_id
                },
                attributes: ['id', 'descricao', 'imagem_url'],
                order: ['descricao'],
                limit: 20,
                offset: (page - 1) * 20,
            });

            return res.json(recompensas);

        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                descricao: Yup.string().required().min(6)
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
            }

            const estabelecimento_id = req.userId;

            const recompensa = await Recompensa.create({
                descricao: req.body.descricao,
                estabelecimento_id
            });

            return res.json(recompensa);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}

export default new RecompensaController();