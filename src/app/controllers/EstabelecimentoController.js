import * as Yup from 'yup';
import { Op } from 'sequelize';
import { cpf as validateCpf, cnpj as validateCnpj } from 'cpf-cnpj-validator';

import Estabelecimento from '../models/Estabelecimento';

class EstabelecimentoController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                cpf_cnpj: Yup.string().required(),
                nome: Yup.string().required().min(6),
                email: Yup.string().email().required(),
                telefone: Yup.string().required(),
                password: Yup.string().required().min(6),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
            }

            const { cpf_cnpj, email } = req.body;

            if (cpf_cnpj.length > 11) {
                if (!validateCnpj.isValid(cpf_cnpj)) {
                    return res.status(400).json({ error: 'CNPJ inválido.' });
                }
            }
            else {
                if (!validateCpf.isValid(cpf_cnpj)) {
                    return res.status(400).json({ error: 'CPF inválido.' });
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
                return res.status(400).json({ error: 'Estabelecimento já cadastrado.' });
            }

            const { id } = await Estabelecimento.create(req.body);

            return res.json({ id });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                nome: Yup.string().min(6),
                email: Yup.string().email(),
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

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
            }

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
                    return res.status(400).json({ error: 'E-mail já cadastrado.' });
                }
            }

            if (oldPassword && !(await estabelecimento.checkPassword(oldPassword))) {
                return res.status(401).json({ error: 'Senha anterior inválida.' });
            }

            const { id } = await estabelecimento.update(req.body);

            return res.json({ id });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

export default new EstabelecimentoController();