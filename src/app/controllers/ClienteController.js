import * as Yup from 'yup';

import Cliente from '../models/Cliente';

class ClienteController {
    async detail(req, res) {
        try {
            const cliente = await Cliente.findByPk(req.userId, {
                attributes: ['cpf', 'nome', 'email', 'telefone', 'avatar_url']
            });

            return res.json(cliente);

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async store(req, res) {
        try {

            const { id, cpf, nome, email, telefone } = await Cliente.create(req.body);

            return res.json({ id, cpf, nome, email, telefone });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async update(req, res) {
        try {
            
            const cliente = await Cliente.findByPk(req.userId);

            delete req.body.cpf;

            const { id, cpf, nome } = await cliente.update(req.body);

            return res.json({ id, cpf, nome });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

export default new ClienteController();