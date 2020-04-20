import request from 'supertest';
import app from '../../src/app';

describe('Cliente', () => {
    it('Deverá ser possível se cadastrar', async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                cpf: "44453395809",
                nome: "Ariene Maiara Ribeiro",
                email: "arienemaiara@gmail.com",
                telefone: "12992090773",
                password: "123456"
            });

        expect(response.body).toHaveProperty('id');
    });
});