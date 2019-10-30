import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

// controla a sessão do usuário e verifica se ele está digitando os dados corretos
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // test schema's requirement with body's information
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { email, password } = req.body; // get from body email and password

    const user = await User.findOne({ where: { email } }); // find if a user using that email exists

    // tests if the user was foud
    if (!user) {
      return req.status(401).json({ error: 'User not found' });
    }

    // check if email matches password
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not macth' });
    }

    // saves id and name from user in a variable
    const { id, name } = user;

    // return the user data do however called this function, with a unique token
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
