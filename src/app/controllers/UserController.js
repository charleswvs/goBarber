import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // receives user data from the body, and creates a new registry in database
  async store(req, res) {
    // creates a schema for testing new users' information
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // test schema's requirement with body's information
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    // check if user already exists
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // returns an erro if it does
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // create a new user using given information
    const { id, name, email, provider } = await User.create(req.body);

    // returns only what is interesting to the front end
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    // creates a schema for testing new users' information
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // test schema's requirement with body's information
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      // returns an erro if it does
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
