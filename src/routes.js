import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

const upload = multer(multerConfig);

//Controllers
import ClienteController from './app/controllers/ClienteController';
import ClienteSessionController from './app/controllers/ClienteSessionController';
import EstabelecimentoController from './app/controllers/EstabelecimentoController';
import EstabelecimentoSessionController from './app/controllers/EstabelecimentoSessionController';
import RecompensaController from './app/controllers/RecompensaController';
import MovimentacaoController from './app/controllers/MovimentacaoController';
import MovimentacaoEstabelecimentoController from './app/controllers/MovimentacaoEstabelecimentoController';

//Validadores
import validatorClienteStore from './app/validators/cliente/ClienteStore';
import validatorClienteUpdate from './app/validators/cliente/ClienteUpdate';
import validatorEstabelecimentoStore from './app/validators/estabelecimento/EstabelecimentoStore';
import validatorEstabelecimentoUpdate from './app/validators/estabelecimento/EstabelecimentoUpdate';
import validatorMovimentacaoStore from './app/validators/movimentacao/MovimentacaoStore';

//Middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/clientes', validatorClienteStore, ClienteController.store);
routes.post('/clientes/login', ClienteSessionController.store);

routes.post('/estabelecimentos', upload.single('file'), validatorEstabelecimentoStore, EstabelecimentoController.store);
routes.post('/estabelecimentos/login', EstabelecimentoSessionController.store);

routes.use(authMiddleware);

routes.get('/clientes/detalhe', ClienteController.detail);
routes.get('/clientes/:cpf', ClienteController.detailCpf);
routes.put('/clientes', validatorClienteUpdate, ClienteController.update);

routes.get('/estabelecimentos', EstabelecimentoController.index);
routes.get('/estabelecimentos/detalhe', EstabelecimentoController.detail);
routes.put('/estabelecimentos', upload.single('file'), validatorEstabelecimentoUpdate, EstabelecimentoController.update);
routes.get('/estabelecimentos/movimentacao', MovimentacaoEstabelecimentoController.index);

routes.get('/recompensas', RecompensaController.index);
routes.post('/recompensas', upload.single('file'), RecompensaController.store);
routes.put('/recompensas/:id', upload.single('file'), RecompensaController.update);
routes.delete('/recompensas/:id', RecompensaController.delete);

routes.get('/movimentacoes', MovimentacaoController.index);
routes.post('/movimentacoes', validatorMovimentacaoStore, MovimentacaoController.store);
routes.get('/pontosPorEstabelecimento', MovimentacaoController.totalPontosPorEstabelecimento);

export default routes;