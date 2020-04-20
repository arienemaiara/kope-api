import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

describe('Cliente', () => {
    it('Deverá ser cadastrado com sucesso', async () => {

        const cliente = await factory.attrs('Cliente');

        const response = await request(app)
            .post('/clientes')
            .send(cliente);

        expect(response.body).toHaveProperty('id');
    });

    // it ('Deverá ter a senha criptografada', async () => {

    // });

    // it ('Não poderá ser cadastrado com cpf duplicado', async () => {

    // });

    // it ('Não poderá ser cadastrado com e-mail duplicado', async () => {

    // });
});