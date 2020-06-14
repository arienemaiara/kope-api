import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

let cliente, estabelecimento, token;

describe('Movimentacoes', () => {

    beforeAll(async () => {
        
        cliente = await factory.attrs('Cliente');
        estabelecimento = await factory.attrs('Estabelecimento');

        await request(app)
            .post('/clientes')
            .send(cliente);

        await request(app)
            .post('/estabelecimentos')
            .field('cpf_cnpj', estabelecimento.cpf_cnpj)
            .field('nome', estabelecimento.nome)
            .field('email', estabelecimento.email)
            .field('telefone', estabelecimento.telefone)
            .field('password', estabelecimento.password)
            .field('enderecos', JSON.stringify(estabelecimento.enderecos))
            .field('file', '')

        const responseLogin = await request(app)
            .post('/estabelecimentos/login')
            .send({
                email: estabelecimento.email,
                password: estabelecimento.password
            });
        token = responseLogin.body.token;
    });

    it('Deverá acumular pontos', async () => {
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