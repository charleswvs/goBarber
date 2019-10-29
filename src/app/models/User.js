import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // not react Hooks
    // create a password hash before saving
    this.addHook('beforeSave', async user => {
      // checks if a password was inserted
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    // return the used method
    return this;
  }

  // checks if password is correct
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
