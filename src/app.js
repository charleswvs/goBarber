// const express = require('express') - common js
import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express(); // defines the server
    this.middlewares(); // if these are not called, they will not be used
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // using jsons requests
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes); // calling routes
  }
}

export default new App().server;
