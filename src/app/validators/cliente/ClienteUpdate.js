import * as Yup from 'yup';
import { Op } from 'sequelize';

import Cliente from '../../models/Cliente';

export default async (req, res, next) => {
    try {
        let err = new Error();

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

        await schema.validate(req.body, { abortEarly: false });

        const { email, oldPassword } = req.body;

        if (req.body.email) {
            const emailJaCadastrado = await Cliente.findOne({
                where: {
                    id: {
                        [Op.not]: req.userId
                    },
                    email: email
                }
            });

            if (emailJaCadastrado) {
                err.inner = 'E-mail já cadastrado.';
                throw err;
            }
        }

        const cliente = await Cliente.findByPk(req.userId);

        if (oldPassword && !(await cliente.checkPassword(oldPassword))) {
            err.inner = 'Senha anterior inválida.';
            throw err;
        }

        return next();

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Erro na validação dos campos.', messages: error.inner });
    }
}