// const express = require('express') - common js
import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';

import 'express-async-errors'; // import before routes
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express(); // defines the server

    Sentry.init(sentryConfig); // initiates sentry

    this.middlewares(); // if these are not called, they will not be used
    this.routes();
    this.exceptionHandler(); // this middleware handles exceptions, used with Sentry
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json()); // using jsons requests
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes); // calling routes
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
