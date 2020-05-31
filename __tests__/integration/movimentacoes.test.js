import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

describe('Movimentacoes', () => {

    let cliente, estabelecimento, token;

    beforeAll(async () => {
        console.log('before all')
        cliente = await factory.attrs('Cliente');
        estabelecimento = await factory.attrs('Estabelecimento');

        let response = await request(app)
            .post('/clientes')
            .send(cliente);

        response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimento);

        const responseLogin = await request(app)
            .post('/estabelecimentos/login')
            .send({
                email: estabelecimento.email,
                password: estabelecimento.password
            });
        token = responseLogin.body.token;

        console.log('token', token)
    });

    it('Deverá acumular pontos', async () => {
        console.log('token acumulo', token)
        const response = await request(app)
            .post('/movimentacoes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                acumulo: true,
                qtd_pontos: 60,
                cpf_usuario: cliente.cpf
            });

        expect(response.status).toBe(200);
    });

    it('Deverá resgatar pontos', async () => {
        const response = await request(app)
            .post('/movimentacoes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                acumulo: false,
                qtd_pontos: 50,
                cpf_usuario: cliente.cpf
            });

        expect(response.status).toBe(200);
    });

    it('Não permite o resgate sem pontos suficientes', async () => {
        const response = await request(app)
            .post('/movimentacoes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                acumulo: false,
                qtd_pontos: 50,
                cpf_usuario: cliente.cpf
            });

        expect(response.status).toBe(400);
    });
});