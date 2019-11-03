import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import User from './app/models/User'; // in case u need to test user creation or something

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store); // inserts a new user in the database
routes.post('/sessions', SessionController.store); // login and session controler

routes.use(authMiddleware); // if you use the middleware before any route it will be used on every one of them

routes.put('/users', UserController.update); // update user

routes.get('/providers', ProviderController.index);

routes.post('/appointments', AppointmentController.store);

routes.post('/files', upload.single('file'), FileController.store);
// Uma maneira de testar o envio do meus dados
// routes.get('/', async (req, res) => {
//   const user = await User.create({
//     name: 'Charles Willian',
//     email: 'charles2@email.com',
//     password_hash: 'charles123',
//   });

//   return res.json(user);
// });

export default routes;
