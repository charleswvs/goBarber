import Sequelize from 'sequelize';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];
// model loader, it loads it model calls it init
class Database {
  constructor() {
    this.init();
  }

  // creates a connection with database
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
