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

    }
}

export default new EstabelecimentoController();