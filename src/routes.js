import { Router } from 'express';

import ClienteController from './app/controllers/ClienteController';
import ClienteSessionController from './app/controllers/ClienteSessionController';
import EstabelecimentoController from './app/controllers/EstabelecimentoController';
import EstabelecimentoSessionController from './app/controllers/EstabelecimentoSessionController';
import RecompensaController from './app/controllers/RecompensaController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/clientes', ClienteController.store);
routes.post('/cliente_session', ClienteSessionController.store);
routes.post('/estabelecimentos', EstabelecimentoController.store);
routes.post('/estabelecimentos_session', EstabelecimentoSessionController.store);

routes.use(authMiddleware);

routes.put('/clientes', ClienteController.update);

routes.put('/estabelecimentos', EstabelecimentoController.update);

routes.get('/recompensas', RecompensaController.index);
routes.post('/recompensas', RecompensaController.store);

export default routes;