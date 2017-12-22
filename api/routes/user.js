'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/user', UserController.home);
api.post('/user', UserController.saveUser);


module.exports = api;