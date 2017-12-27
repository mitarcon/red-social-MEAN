'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelwares/authenticated');

var api = express.Router();

// api.get('/user', md_auth.ensureAuth, UserController.home);
api.get('/user', md_auth.ensureAuth, UserController.getUsers);
api.post('/user',  md_auth.ensureAuth, UserController.saveUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.post('/user/action/login', UserController.loginUser);


module.exports = api;