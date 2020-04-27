import * as Yup from 'yup';

import EstabelecimentoEndereco from '../models/EstabelecimentoEndereco';

class EnderecoService {

    async validarListaEndereco(enderecos) {
        return Promise.all(
            enderecos.map(async (endereco) => {
                return this.validarEndereco(endereco);
            })
        );
    }

    async validarEndereco(endereco) {

        return new Promise(async (resolve, reject) => {
            const schema = Yup.object().shape({
                endereco: Yup.string().required().min(10),
                numero: Yup.string().required(),
                cep: Yup.string().required(),
                bairro: Yup.string().required(),
                cidade: Yup.string().required(),
                estado: Yup.string().required(),
            });
    
            const enderecoValido = await schema.isValid(endereco);

            if (enderecoValido === true) {
                resolve();
            }
            else {
                reject('Verifique os campos de endereço.');
            }
        });
        
    }

}

export default new EnderecoService();