import sequelize from 'sequelize';

import Movimentacao from '../models/Movimentacao';
import Cliente from '../models/Cliente';

class MovimentacaoEstabelecimentoController {
    async index(req, res) {
        try {
            const { page = 1 } = req.query;
            const estabelecimento_id = req.userId;

            const movimentacoes = await Movimentacao.findAll({
                where: {
                    estabelecimento_id,
                    acumulo: false
                },
                include: [
                    {
                        model: Cliente,
                        as: 'cliente',
                        attributes: ['id', 'nome']
                    }
                ],
                attributes: ['id', 'qtd_pontos', 'acumulo', 'created_at'],
                order: [['created_at', 'DESC']],
                limit: 20,
                offset: (page - 1) * 20,
            });

            return res.json(movimentacoes);

        } catch (error) {
            return res.status(500).json({ error });
        }
    }

}

export default new MovimentacaoEstabelecimentoController();