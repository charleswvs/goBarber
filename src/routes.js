import { Router } from 'express';
import User from './app/models/User';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('./users', UserController.store);

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
