import Sequelize from 'sequelize';

import Estabelecimento from '../models/Estabelecimento';
import EstabelecimentoEndereco from '../models/EstabelecimentoEndereco';

import database from '../../database';

class EstabelecimentoController {
    async index(req, res) {
        try {

            const { page = 1, latitude, longitude } = req.query;

            const estabelecimentosEnderecos = await EstabelecimentoEndereco.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.fn(
                                'ST_Distance',
                                Sequelize.fn(
                                    'ST_Transform', 
                                    Sequelize.col('coordenadas'), 
                                3857),
                                Sequelize.fn(
                                    'ST_Transform',
                                    Sequelize.fn('ST_SetSRID',
                                        Sequelize.fn('ST_MakePoint', longitude, latitude),
                                        4326
                                    ),
                                    3857
                                ),

                            ),
                            'distancia'
                        ]
                    ]
                },
                include: [
                    {
                        model: Estabelecimento,
                        as: 'estabelecimento',
                        attributes: ['id', 'nome', 'avatar_path', 'avatar_url', 'email', 'telefone']
                    },
                ],
                order: Sequelize.literal('distancia ASC'),
                limit: 20,
                offset: (page - 1) * 20,
            });

            return res.json(estabelecimentosEnderecos);

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async detail(req, res) {
        try {
            const estabelecimento = await Estabelecimento.findByPk(req.userId, {
                attributes: ['cpf_cnpj', 'nome', 'email', 'telefone', 'avatar_path', 'avatar_url'],
                include: ['enderecos']
            });

            return res.json(estabelecimento);

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async store(req, res) {
        try {

            const avatar_nome = req.file?.key || req.file?.filename;
            const avatar_path = req.file?.location || req.file?.filename;
           
            const estabelecimentoData = {
                ...req.body,
                enderecos: JSON.parse(req.body.enderecos),
                avatar_nome,
                avatar_path
            }

            const { id, nome } = await Estabelecimento.create(estabelecimentoData, {
                include: ['enderecos']
            });

            return res.json({ id, nome });

        } catch (error) {
            //console.log(error)
            return res.status(500).json({ error });
        }
    }

    async update(req, res) {
        try {
            const estabelecimento_id = req.userId;
            const enderecos = JSON.parse(req.body.enderecos);

            const estabelecimento = await Estabelecimento.findOne({
                where: {
                    id: estabelecimento_id
                }
            });

            let avatar_nome = estabelecimento.avatar_nome;
            let avatar_path = estabelecimento.avatar_path;

            if (req.file && avatar_nome !== req.file?.filename) {
                avatar_nome = req.file?.key || req.file?.filename;
                avatar_path = req.file?.location || req.file?.filename;
            }

            await database.connection.transaction(async (t) => {
                delete req.body.cpf_cnpj;
                await Estabelecimento.update({
                    ...req.body,
                    avatar_nome,
                    avatar_path
                }, {
                    where: {
                        id: estabelecimento_id
                    },
                    transaction: t
                });

                if (process.env.NODE_ENV === 'test') {
                    return;
                }

                await EstabelecimentoEndereco.destroy({
                    where: {
                        estabelecimento_id
                    },
                    transaction: t
                });

                return Promise.all(
                    enderecos.map(async (endereco) => {
                        delete endereco.id;
                        return EstabelecimentoEndereco.create({
                            ...endereco,
                            estabelecimento_id
                        })
                    })
                );
            })
            .then(() => {
                return res.json({ message: 'OK' });
            });


        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

export default new EstabelecimentoController();