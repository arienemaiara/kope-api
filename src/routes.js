import { Router } from 'express';

import ClienteController from './app/controllers/ClienteController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/clientes', ClienteController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.put('/clientes', ClienteController.update);

export default routes;