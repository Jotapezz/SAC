const express = require('express');
const api = express.Router();

const { UsersController } = require('../controllers');



api.get('/v1/userTest', UsersController.getUser);
api.post('/v1/addUser', UsersController.addUser);




module.exports = api;
