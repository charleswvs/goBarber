import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Charles Willian',
    email: 'charles@email.com',
    password_hash: 'charles123',
  });

  return res.json(user);
});

export default routes;
