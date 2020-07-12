import sequelize from 'sequelize';

import Movimentacao from '../models/Movimentacao';
import Estabelecimento from '../models/Estabelecimento';
import Cliente from '../models/Cliente';

class MovimentacaoController {
    async index(req, res) {
        try {
            const { page = 1, estabelecimento_id } = req.query;
            const cliente_id = req.userId;

            const movimentacoes = await Movimentacao.findAll({
                where: {
                    estabelecimento_id,
                    cliente_id
                },
                attributes: ['id', 'qtd_pontos', 'acumulo', 'created_at'],
                order: [['created_at', 'DESC']],
                limit: 20,
                offset: (page - 1) * 20,
            });

            const total_pontos = await Movimentacao.getSomaPontos(cliente_id, estabelecimento_id) || 0;

            return res.json({ total_pontos, movimentacoes });

        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    async totalPontosPorEstabelecimento(req, res) {
        try {

            const cliente_id = req.userId;

            const somaPontosPorEstabelecimento = await Movimentacao.findAll({
                where: {
                    cliente_id
                },
                attributes:[
                    [sequelize.fn('sum', sequelize.col('qtd_pontos')), 'total_pontos'],
                ],
                include: [
                    {
                        model: Estabelecimento,
                        as: 'estabelecimento',
                        attributes: ['id', 'cpf_cnpj', 'nome']
                    }
                ],
                group: ['estabelecimento.id'],
            });

            return res.json(somaPontosPorEstabelecimento);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }

    async store(req, res) {
        try {
            let { acumulo, qtd_pontos, cpf_usuario } = req.body;
            const estabelecimento_id = req.userId;

            const cliente = await Cliente.findOne({ where: { cpf: cpf_usuario }});

            //Deixa a quantidade de pontos negativa em caso de resgate
            qtd_pontos = acumulo === false ? qtd_pontos * -1 : qtd_pontos;

            const movimentacao = await Movimentacao.create({
                estabelecimento_id,
                cliente_id: cliente.id,
                qtd_pontos: qtd_pontos,
                acumulo: acumulo
            });

            return res.json(movimentacao);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}

export default new MovimentacaoController();