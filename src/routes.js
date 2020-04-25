import { Router } from 'express';

//Controllers
import ClienteController from './app/controllers/ClienteController';
import ClienteSessionController from './app/controllers/ClienteSessionController';
import EstabelecimentoController from './app/controllers/EstabelecimentoController';
import EstabelecimentoSessionController from './app/controllers/EstabelecimentoSessionController';
import RecompensaController from './app/controllers/RecompensaController';
import MovimentacaoController from './app/controllers/MovimentacaoController';

//Validadores
import validatorClienteStore from './app/validators/cliente/ClienteStore';
import validatorClienteUpdate from './app/validators/cliente/ClienteUpdate';
import validatorEstabelecimentoStore from './app/validators/estabelecimento/EstabelecimentoStore';
import validatorEstabelecimentoUpdate from './app/validators/estabelecimento/EstabelecimentoUpdate';

//Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/clientes', validatorClienteStore, ClienteController.store);
routes.post('/cliente_session', ClienteSessionController.store);

routes.post('/estabelecimentos', validatorEstabelecimentoStore, EstabelecimentoController.store);
routes.post('/estabelecimentos_session', EstabelecimentoSessionController.store);

routes.use(authMiddleware);

routes.put('/clientes', validatorClienteUpdate, ClienteController.update);

routes.put('/estabelecimentos', validatorEstabelecimentoUpdate, EstabelecimentoController.update);

routes.get('/recompensas', RecompensaController.index);
routes.post('/recompensas', RecompensaController.store);
routes.put('/recompensas/:id', RecompensaController.update);

routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', MovimentacaoController.store);
routes.get('/pontosPorEstabelecimento', MovimentacaoController.totalPontosPorEstabelecimento);

export default routes;