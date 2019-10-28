import User from '../models/User';

class UserController {
  // recebe os dados informados pelo usuário e cria um novo registro na base de dados
  async store(req, res) {
    const user = await User.create(req.body);

    return res.json(user);
  }
}

export default new UserController();
