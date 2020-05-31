import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

describe('Estabelecimento', () => {

    let token, estabelecimento, recompensa_id;

    beforeAll(async () => {
        estabelecimento = await factory.attrs('Estabelecimento');

        let response = await request(app)
            .post('/estabelecimentos')
            .send(estabelecimento);

        const responseLogin = await request(app)
            .post('/estabelecimentos/login')
            .send({
                email: estabelecimento.email,
                password: estabelecimento.password
            });
        token = responseLogin.body.token;
    });

    it('Deverá ser cadastrado com sucesso', async () => {
        let response = await request(app)
            .post('/recompensas')
            .set('Authorization', `Bearer ${token}`)
            .send({
                descricao: 'X-burguer',
                qtd_pontos: 80
            });

        recompensa_id = response.body.id;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('descricao', 'X-burguer');

    });

    it('Deverá ser alterado com sucesso', async () => {
        let response = await request(app)
            .put('/recompensas/' + recompensa_id)
            .set('Authorization', `Bearer ${token}`)
            .send({
                descricao: 'X-Salada',
                qtd_pontos: 60
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('descricao', 'X-Salada');
        expect(response.body).toHaveProperty('qtd_pontos', 60);
    });

    it('Não deverá alterar recompensa de id inexistente', async () => {
        let response = await request(app)
            .put('/recompensas/99')
            .set('Authorization', `Bearer ${token}`)
            .send({
                descricao: 'Acai 500',
                qtd_pontos: 60
            });

        expect(response.status).toBe(400);
    });
});