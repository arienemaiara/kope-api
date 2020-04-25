import * as Yup from 'yup';
import { Op } from 'sequelize';
import { cpf as validateCpf } from 'cpf-cnpj-validator';

import Cliente from '../../models/Cliente';

export default async (req, res, next) => {
    try {
        let err = new Error();

        const schema = Yup.object().shape({
            cpf: Yup.string().required(),
            nome: Yup.string().required().min(10),
            email: Yup.string().email().required(),
            telefone: Yup.string().required(),
            password: Yup.string().required().min(6),
        });

        await schema.validate(req.body, { abortEarly: false });

        if (!validateCpf.isValid(req.body.cpf)) {
            err.inner = 'CPF inválido.';
            throw err;
        }

        const clienteJaCadastrado = await Cliente.findOne({
            where: {
                [Op.or]: [
                    { cpf: req.body.cpf },
                    { email: req.body.email }
                ]

            }
        });

        if (clienteJaCadastrado) {    
            err.inner = 'Usuário já cadastrado.';
            throw err;
        }

        return next();


    } catch (error) {
        return res.status(400).json({ error: 'Erro na validação dos campos.', messages: error.inner });
    }
}