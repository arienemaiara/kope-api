import request from 'supertest';
import bcrypt from 'bcryptjs';

import factory from '../factories';
import app from '../../src/app';

let cliente;
let token;

describe('Cliente', () => {

    beforeAll(async () => {
        cliente = await factory.attrs('Cliente');
    });

    it('Deverá ser cadastrado com sucesso', async () => {
        const response = await request(app)
            .post('/clientes')
            .send(cliente);

        expect(response.body).toHaveProperty('id');
    });

    it('Deverá ter a senha criptografada', async () => {
        const novoCliente = await factory.create('Cliente');

        const compareHash = await bcrypt.compare('123456', novoCliente.password_hash);

        expect(compareHash).toBe(true);
    });

    it('Não poderá ser cadastrado usuário duplicado', async () => {
        const response = await request(app)
            .post('/clientes')
            .send(cliente);

        expect(response.body).toHaveProperty('messages', 'Usuário já cadastrado.');
    });

    it('Usuário deverá estar autenticado para fazer alteração', async () => {
        const response = await request(app)
            .put('/clientes')
            .send(cliente);

        expect(response.status).toBe(401);
    });

    it('Deverá retornar um token', async () => {
        const responseLogin = await request(app)
            .post('/clientes/login')
            .send({
                email: cliente.email,
                password: cliente.password
            });
        token = responseLogin.body.token;

        expect(token).not.toBeUndefined();
    });

    it('Deverá dar erro usuário inválido', async () => {
        const response = await request(app)
            .post('/clientes/login')
            .send({
                email: 'fake@email.com',
                password: cliente.password
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Usuário não encontrado.');
    });

    it('Deverá dar erro senha inválida', async () => {
        const response = await request(app)
            .post('/clientes/login')
            .send({
                email: cliente.email,
                password: 'invalid password' 
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Senha inválida.');
    });

    it('Deverá trazer os detalhes do cliente logado', async () => {
        const response = await request(app)
            .get('/clientes/detalhe')
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', cliente.nome);
    });

    it('Deverá trazer os detalhes do cliente por cpf', async () => {
        const response = await request(app)
            .get('/clientes/'+cliente.cpf)
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', cliente.nome);
    });

    it('Não poderá ser alterado o campo CPF', async () => {
        const novoCliente = cliente;
        const cpfOriginal = cliente.cpf;

        //Altera os dados
        novoCliente.cpf = '72556297093';
        novoCliente.nome = 'Novo nome';
        delete novoCliente.password;

        const clienteAlterado = await request(app)
            .put('/clientes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cpf: novoCliente.cpf,
                nome: novoCliente.nome
            });

        expect(clienteAlterado.body).toHaveProperty('cpf', cpfOriginal);
        expect(clienteAlterado.body).toHaveProperty('nome', novoCliente.nome);
    }, 50000);

});