import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

let estabelecimento;
let formData;
let token;

describe('Estabelecimento', () => {

    beforeAll(async () => {
        estabelecimento = await factory.attrs('Estabelecimento');
    });

    it('Deverá ser cadastrado com sucesso', async () => {
        const response = await request(app)
            .post('/estabelecimentos')
            .field('cpf_cnpj', estabelecimento.cpf_cnpj)
            .field('nome', estabelecimento.nome)
            .field('email', estabelecimento.email)
            .field('telefone', estabelecimento.telefone)
            .field('password', estabelecimento.password)
            .field('enderecos', JSON.stringify(estabelecimento.enderecos))
            .field('file', '')

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    it('Não poderá cadastrar estabelecimento duplicado', async () => {
        const response = await request(app)
            .post('/estabelecimentos')
            .field('cpf_cnpj', estabelecimento.cpf_cnpj)
            .field('nome', estabelecimento.nome)
            .field('email', estabelecimento.email)
            .field('telefone', estabelecimento.telefone)
            .field('password', estabelecimento.password)
            .field('enderecos', JSON.stringify(estabelecimento.enderecos))
            .field('file', '')

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('Estabelecimento já cadastrado.');
    });

    it('Não poderá cadastrar CNPJ inválido', async () => {
        const estabelecimentoInvalido = estabelecimento;
        estabelecimentoInvalido.cpf_cnpj = '84624274938652';
        const response = await request(app)
            .post('/estabelecimentos')
            .field('cpf_cnpj', estabelecimentoInvalido.cpf_cnpj)
            .field('nome', estabelecimentoInvalido.nome)
            .field('email', estabelecimentoInvalido.email)
            .field('telefone', estabelecimentoInvalido.telefone)
            .field('password', estabelecimentoInvalido.password)
            .field('enderecos', JSON.stringify(estabelecimentoInvalido.enderecos))
            .field('file', '')

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('CNPJ inválido.');
    });

    it('Deverá retornar um token', async () => {
        const responseLogin = await request(app)
            .post('/estabelecimentos/login')
            .send({
                email: estabelecimento.email,
                password: estabelecimento.password
            });
        token = responseLogin.body.token;

        expect(responseLogin.status).toBe(200);
        expect(token).not.toBeNull();
    });

    it('Deverá mostrar detalhes estabelecimento', async() => {
        const response = await request(app)
            .get('/estabelecimentos/detalhe')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe(estabelecimento.nome);
    });

    it('Não deixar alterar senha anterior inválida', async () => {
        const novoEstabelecimento = estabelecimento;

        novoEstabelecimento.oldPassword = '7777777';
        novoEstabelecimento.password = '123456789';
        novoEstabelecimento.confirmPassword = '123456789';

        let response = await request(app)
            .put('/estabelecimentos')
            .set('Authorization', `Bearer ${token}`)
            .field('cpf_cnpj', novoEstabelecimento.cpf_cnpj)
            .field('nome', novoEstabelecimento.nome)
            .field('email', novoEstabelecimento.email)
            .field('telefone', novoEstabelecimento.telefone)
            .field('password', novoEstabelecimento.password)
            .field('oldPassword', novoEstabelecimento.oldPassword)
            .field('confirmPassword', novoEstabelecimento.confirmPassword)
            .field('enderecos', JSON.stringify(novoEstabelecimento.enderecos))
            .field('file', '')

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('Senha anterior inválida.');
    });

    it('Deverá ser alterado com sucesso', async () => {

        const novoEstabelecimento = estabelecimento;
        novoEstabelecimento.nome = 'Novo Nome';
        delete novoEstabelecimento.password;
        delete novoEstabelecimento.oldPassword;
        delete novoEstabelecimento.confirmPassword;

        const estabelecimentoAlterado = await request(app)
            .put('/estabelecimentos')
            .set('Authorization', `Bearer ${token}`)
            .field('cpf_cnpj', novoEstabelecimento.cpf_cnpj)
            .field('nome', novoEstabelecimento.nome)
            .field('email', novoEstabelecimento.email)
            .field('telefone', novoEstabelecimento.telefone)
            .field('enderecos', JSON.stringify(novoEstabelecimento.enderecos))
            .field('file', '')

        expect(estabelecimentoAlterado.body).toHaveProperty('message', 'OK');

    }, 50000);

});