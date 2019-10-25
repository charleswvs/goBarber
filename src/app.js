//const express = require('express') - common js
import routes from './routes';
import express from 'express';

class App {
    constructor (){
        this.server = express(); //defines the server
        this.middlewares(); //if these are not called, they will not be used
        this.routes();
    }

    middlewares(){
        this.server.use(express.json()); //using jsons requests
    }

    routes(){
        this.server.use(routes) // calling routes
    }
}

export default new App().server;