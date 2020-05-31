import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

describe('Estabelecimento', () => {

    let estabelecimento;
    let token;

    beforeAll(async () => {
        estabelecimento = await factory.attrs('Estabelecimento');
    });

    it('Deverá ser cadastrado com sucesso', async () => {
        const response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimento);

        expect(response.body).toHaveProperty('id');
    });

    it('Não poderá cadastrar CPF/CNPJ duplicado', async () => {
        const response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimento);

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('Estabelecimento já cadastrado.');
    });

    it('Não poderá cadastrar CNPJ inválido', async () => {
        const estabelecimentoInvalido = estabelecimento;
        estabelecimentoInvalido.cpf_cnpj = '84624274938652';
        const response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimentoInvalido);

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('CNPJ inválido.');
    });

    it('Não poderá cadastrar CPF inválido', async () => {
        const estabelecimentoInvalido = estabelecimento;
        estabelecimentoInvalido.cpf_cnpj = '83625484725';
        const response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimentoInvalido);

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('CPF inválido.');
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

    it('Não deixar passar senha anterior inválida', async () => {
        const novoEstabelecimento = estabelecimento;

        novoEstabelecimento.oldPassword = '7777777';
        novoEstabelecimento.password = '123456789';
        novoEstabelecimento.confirmPassword = '123456789';

        let response = await request(app)
            .put('/estabelecimentos')
            .set('Authorization', `Bearer ${token}`)
            .send(novoEstabelecimento);

        expect(response.status).toBe(400);
        expect(response.body.messages).toBe('Senha anterior inválida.');
    });

    // // it('Deverá ser alterado com sucesso', async () => {

    // //     const novoEstabelecimento = estabelecimento;
    // //     novoEstabelecimento.nome = 'Novo Nome';
    // //     delete novoEstabelecimento.password;
    // //     delete novoEstabelecimento.oldPassword;
    // //     delete novoEstabelecimento.confirmPassword;

    // //     const estabelecimentoAlterado = await request(app)
    // //         .put('/estabelecimentos')
    // //         .set('Authorization', `Bearer ${token}`)
    // //         .send(novoEstabelecimento)
    // //         .timeout(50000);

    // //     expect(estabelecimentoAlterado.body).toBe(novoEstabelecimento.nome);

    // // }, 50000);

});