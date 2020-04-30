import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

describe('Estabelecimento', () => {

    let estabelecimento;

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

    it('Deverá ser alterado com sucesso', async () => {

        const novoEstabelecimento = await factory.attrs('Estabelecimento');
        let response = await request(app)
            .post('/estabelecimentos')
            .send(novoEstabelecimento);

        const responseLogin = await request(app)
            .post('/estabelecimentos_session')
            .send({
                cpf_cnpj: novoEstabelecimento.cpf_cnpj,
                password: novoEstabelecimento.password
            });
        const token = responseLogin.body.token;

        novoEstabelecimento.nome = 'Novo Nome';
        delete novoEstabelecimento.password;

        setTimeout( async () => {
            response = await request(app)
                .put('/estabelecimentos')
                .set('Authorization', `Bearer ${token}`)
                .send(novoEstabelecimento);

            expect(response.body).toBe(novoEstabelecimento.nome);
        }, 3000)


    }, 30000);

    it('Não deixar passar senha anterior inválida', async () => {
        const novoEstabelecimento = await factory.attrs('Estabelecimento');
        let response = await request(app)
            .post('/estabelecimentos')
            .send(novoEstabelecimento);

        const responseLogin = await request(app)
            .post('/estabelecimentos_session')
            .send({
                cpf_cnpj: novoEstabelecimento.cpf_cnpj,
                password: novoEstabelecimento.password
            });
        const token = responseLogin.body.token;


        novoEstabelecimento.oldPassword = '7777777';
        novoEstabelecimento.password = '123456789';
        novoEstabelecimento.confirmPassword = '123456789';

        setTimeout( async () => {
            response = await request(app)
                .put('/estabelecimentos')
                .set('Authorization', `Bearer ${token}`)
                .send(novoEstabelecimento);

            expect(response.status).toBe(400);
            expect(response.body.messages).toBe('Senha anterior inválida.');
        }, 3000)
    }, 30000);

});