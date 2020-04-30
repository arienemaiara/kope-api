import request from 'supertest';
import bcrypt from 'bcryptjs';

import factory from '../factories';
import app from '../../src/app';



describe('Cliente', () => {

    let cliente;
    let token;

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
            .post('/cliente_session')
            .send({
                cpf: cliente.cpf,
                password: cliente.cpf
            });
        const token = responseLogin.body.token;

        expect(token).not.toBeNull();
    });

    it('Não poderá ser alterado o campo CPF', async () => {
        const novoCliente = cliente;
        const cpfOriginal = novoCliente.cpf;

        //Se autentica
        const responseLogin = await request(app)
            .post('/cliente_session')
            .send({
                cpf: cpfOriginal,
                password: '123456'
            });
        const token = responseLogin.body.token;

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
    });
});