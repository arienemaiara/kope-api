import * as Yup from 'yup';

import Movimentacao from '../../models/Movimentacao';
import Cliente from '../../models/Cliente';

export default async (req, res, next) => {
    try {
        let err = new Error();

        const schema = Yup.object().shape({
            cpf_usuario: Yup.string().required(),
            qtd_pontos: Yup.number().required().integer(),
            acumulo: Yup.boolean().required()
        });

        await schema.validate(req.body, { abortEarly: false });

        let { acumulo, qtd_pontos, cpf_usuario } = req.body;

        const cliente = await Cliente.findOne({
            where: {
                cpf: cpf_usuario
            }
        });

        if (!cliente) {
            err.inner = 'Cliente não encontrado.';
            throw err;
        }

        const estabelecimento_id = req.userId;

        //Resgate
        if (acumulo === false) {
            //Verifica se a quantidade de pontos que o usuário tem é suficiente para resgate
            const qtdPontosAtuais = await Movimentacao.getSomaPontos(cliente.id, estabelecimento_id) || 0;
            if (qtd_pontos > qtdPontosAtuais) {
                err.inner = `Pontos insuficientes para resgate. Pontos disponíveis: ${qtdPontosAtuais}`;
                throw err;
            }
        }


        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Erro na validação.', messages: error.inner });
    }
}