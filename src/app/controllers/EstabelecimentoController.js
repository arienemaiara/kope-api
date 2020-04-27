import * as Yup from 'yup';
import { Op } from 'sequelize';

import Estabelecimento from '../models/Estabelecimento';
import EnderecoService from '../services/EnderecoService';

class EstabelecimentoController {
    async store(req, res) {
        try {

            const enderecos = [...req.body.enderecos];

            const { id, cpf_cnpj, nome } = await Estabelecimento.create(req.body)
                .then(() => {
                    //Cadastra os endereços
                    EnderecoService.cadastrarEnderecos(id, enderecos);
                });

            return res.json({ id, cpf_cnpj, nome });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    async update(req, res) {
        try {

            const estabelecimento = await Estabelecimento.findByPk(req.userId);

            delete req.body.cpf_cnpj;
            const { id, cpf_cnpj, nome } = await estabelecimento.update(req.body);

            return res.json({ id, cpf_cnpj, nome });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

export default new EstabelecimentoController();