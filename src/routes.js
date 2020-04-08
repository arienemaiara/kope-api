import { Router } from 'express';

import ClienteController from './app/controllers/ClienteController';

const routes = new Router();

routes.post('/clientes', ClienteController.store);

export default routes;