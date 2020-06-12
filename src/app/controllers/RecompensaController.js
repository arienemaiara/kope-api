import * as Yup from 'yup';

import Recompensa from '../models/Recompensa';

class RecompensaController {
    async index(req, res) {
        try {
            const { page = 1, estabelecimento_id } = req.query;

            const recompensas = await Recompensa.findAll({
                where: {
                    estabelecimento_id
                },
                attributes: ['id', 'descricao', 'qtd_pontos', 'imagem_path', 'imagem_url'],
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
                descricao: Yup.string().required().min(6),
                qtd_pontos: Yup.number().required().integer()
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
            }

            const estabelecimento_id = req.userId;

            const { originalname: imagem_nome, filename: imagem_path} = req.file; 

            const recompensa = await Recompensa.create({
                descricao: req.body.descricao,
                qtd_pontos: req.body.qtd_pontos,
                imagem_nome,
                imagem_path,
                estabelecimento_id
            });

            return res.json(recompensa);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                descricao: Yup.string().min(6),
                qtd_pontos: Yup.number().integer()
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
            }

            const { id } = req.params;
            const estabelecimento_id = req.userId;

            const recompensa = await Recompensa.findOne({
                where: {
                    id,
                    estabelecimento_id
                }
            });

            if (!recompensa) {
                return res.status(400).json({ error: 'Recompensa não encontrada.' });
            }

            const { descricao, qtd_pontos } = await recompensa.update(req.body);

            return res.json({ descricao, qtd_pontos });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await Recompensa.destroy({
                where: {
                    id
                }
            });
            return res.json({ message: 'OK' });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}

export default new RecompensaController();