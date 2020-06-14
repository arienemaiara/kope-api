import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

let token, estabelecimento, recompensa_id;

describe('Estabelecimento', () => {

    beforeAll(async () => {
        estabelecimento = await factory.attrs('Estabelecimento');

        const response = await request(app)
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

    it('Deverá ser cadastrado com sucesso', async () => {
        let response = await request(app)
            .post('/recompensas')
            .set('Authorization', `Bearer ${token}`)
            .field('descricao', 'X-burguer')
            .field('qtd_pontos', 80)
            .field('file', '')

        recompensa_id = response.body.id;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('descricao', 'X-burguer');
    });

    it('Deverá ser alterado com sucesso', async () => {
        let response = await request(app)
            .put('/recompensas/' + recompensa_id)
            .set('Authorization', `Bearer ${token}`)
            .field('descricao', 'X-Salada')
            .field('qtd_pontos', 60)
            .field('file', '')

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('descricao', 'X-Salada');
        expect(response.body).toHaveProperty('qtd_pontos', '60');
    });

    it('Não deverá alterar recompensa de id inexistente', async () => {
        let response = await request(app)
            .put('/recompensas/99')
            .set('Authorization', `Bearer ${token}`)
            .field('descricao', 'X-Salada')
            .field('qtd_pontos', 60)
            .field('file', '')

        expect(response.status).toBe(400);
    });

    it('Não deverá alterar recompensa com campos inválidos', async () => {
        let response = await request(app)
            .put('/recompensas/99')
            .set('Authorization', `Bearer ${token}`)
            .field('descricao', '')
            .field('qtd_pontos', 0)
            .field('file', '')

        expect(response.status).toBe(400);
    });
});