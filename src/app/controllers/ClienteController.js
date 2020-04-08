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
}

export default new ClienteController();