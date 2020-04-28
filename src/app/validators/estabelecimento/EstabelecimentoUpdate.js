import * as Yup from 'yup';
import { Op } from 'sequelize';

import Estabelecimento from '../../models/Estabelecimento';
import EnderecoService from '../../services/EnderecoService';

export default async (req, res, next) => {
    try {
        let err = new Error();

        const schema = Yup.object().shape({
            nome: Yup.string().min(6).required(),
            email: Yup.string().email().required(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        await schema.validate(req.body, { abortEarly: false });

        const enderecos = [...req.body.enderecos];

        if (!req.body.enderecos || enderecos.length === 0) {
            err.inner = 'Informe pelo menos 1 endereço.';
            throw err;
        }

        await EnderecoService.validarListaEndereco(enderecos)
        .catch((error) => {
            err.inner = error;
            throw err;
        });

        const { email, oldPassword } = req.body;

        const estabelecimento = await Estabelecimento.findByPk(req.userId);

        if (email) {
            const emailJaCadastrado = await Estabelecimento.findOne({
                where: {
                    cpf_cnpj: {
                        [Op.not]: estabelecimento.cpf_cnpj
                    },
                    email: email
                }
            });

            if (emailJaCadastrado) {
                err.inner = 'E-mail já cadastrado.';
                throw err;
            }
        }

        if (oldPassword && !(await estabelecimento.checkPassword(oldPassword))) {
            err.inner = 'Senha anterior inválida.';
            throw err;
        }

        return next();

    } catch (error) {
        return res.status(400).json({ error: 'Erro na validação dos campos.', messages: error.inner });
    }
}