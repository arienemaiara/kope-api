import faker from 'faker';
import * as fakerBR from "faker-br";
import { factory } from 'factory-girl';

import Cliente from '../src/app/models/Cliente';
import Estabelecimento from '../src/app/models/Estabelecimento';

faker.locale = "pt_BR";

factory.define('Cliente', Cliente, {
    cpf: fakerBR.br.cpf(),
    nome: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    telefone: faker.phone.phoneNumber()
});

factory.define('Estabelecimento', Estabelecimento, {
    cpf_cnpj: fakerBR.br.cnpj(),
    nome: faker.company.companyName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    telefone: faker.phone.phoneNumber()
});

export default factory;