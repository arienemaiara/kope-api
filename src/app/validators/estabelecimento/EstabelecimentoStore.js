import * as Yup from 'yup';
import { Op } from 'sequelize';
import { cpf as validateCpf, cnpj as validateCnpj } from 'cpf-cnpj-validator';

import Estabelecimento from '../../models/Estabelecimento';
import EnderecoService from '../../services/EnderecoService';

export default async (req, res, next) => {
    try {
        let err = new Error();

        const schema = Yup.object().shape({
            cpf_cnpj: Yup.string().required(),
            nome: Yup.string().required().min(6),
            email: Yup.string().email().required(),
            telefone: Yup.string().required(),
            password: Yup.string().required().min(6),
        });

        await schema.validate(req.body, { abortEarly: false });

        const { enderecos } = req.body;

        if (!req.body.enderecos || enderecos.length === 0) {
            err.inner = 'Informe pelo menos 1 endereço.';
            throw err;
        }

        await EnderecoService.validarListaEndereco(enderecos)
        .catch((error) => {
            err.inner = error;
            throw err;
        });

        const { cpf_cnpj, email } = req.body;

        if (cpf_cnpj.length > 11) {
            if (!validateCnpj.isValid(cpf_cnpj)) {
                err.inner = 'CNPJ inválido.';
                throw err;
            }
        }
        else {
            if (!validateCpf.isValid(cpf_cnpj)) {
                err.inner = 'CPF inválido.';
                throw err;
            }
        }

        const estabelecimentoJaCadastrado = await Estabelecimento.findOne({
            where: {
                [Op.or]: [
                    { cpf_cnpj: cpf_cnpj },
                    { email: email }
                ]
            }
        });

        if (estabelecimentoJaCadastrado) {
            err.inner = 'Estabelecimento já cadastrado.';
            throw err;
        }

        return next();

    } catch (error) {
        //console.log(error);
        return res.status(400).json({ error: 'Erro na validação dos campos.', messages: error.inner });
    }
}