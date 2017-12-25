'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelwares/authenticated');

var api = express.Router();

// api.get('/user', md_auth.ensureAuth, UserController.home);
api.post('/user', UserController.saveUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.post('/user/action/login', UserController.loginUser);


module.exports = api;