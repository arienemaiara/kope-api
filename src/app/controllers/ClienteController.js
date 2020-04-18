import * as Yup from 'yup';
import { Op } from 'sequelize';

import Cliente from '../models/Cliente';

class ClienteController {
    async store(req, res) {
        try {
            const schema = Yup.object().shape({
                cpf: Yup.string().required(),
                nome: Yup.string().required().min(10),
                email: Yup.string().email().required(),
                telefone: Yup.string().required(),
                password: Yup.string().required().min(6),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: 'Erro na validação dos campos. Verifique os valores informados.' });
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
                return res.status(400).json({ error: 'Usuário já cadastrado.' });
            }

            const { id, cpf, nome, email, telefone } = await Cliente.create(req.body);

            return res.json({
                id,
                cpf,
                nome,
                email,
                telefone
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }

    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                nome: Yup.string(),
                email: Yup.string().email(),
                telefone: Yup.string(),
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

            if (req.body.email) {
                const emailJaCadastrado = await Cliente.findOne({
                    where: {
                        email: email
                    }
                });

                if (emailJaCadastrado) {
                    return res.status(400).json({ error: 'E-mail já cadastrado.' });
                }
            }

            const cliente = await Cliente.findByPk(req.userId);

            if (oldPassword && !(await cliente.checkPassword(oldPassword))) {
                return res.status(401).json({ error: 'Senha anterior inválida.' });
            }

            const { id, cpf, nome } = await cliente.update(req.body);

            return res.json({
                id,
                cpf,
                nome
            });


        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

export default new ClienteController();