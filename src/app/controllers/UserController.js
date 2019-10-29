import User from '../models/User';

class UserController {
  // receives user data from the body, and creates a new registry in database
  async store(req, res) {
    // check if user already exists
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // returns an erro if it does
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // create a new user using given information
    const { id, name, email, provider } = await User.create(req.body);

    // returns only what is interesting for the front end
    console.log(id, name, email, provider);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
