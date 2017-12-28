'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelwares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: UserController.urlUserImg});

// api.get('/user', md_auth.ensureAuth, UserController.home);
api.get('/user', md_auth.ensureAuth, UserController.getUsers);
api.post('/user',  md_auth.ensureAuth, UserController.saveUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/user/:id/upload/image', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.post('/user/action/login', UserController.loginUser);
api.get('/user/action/image/:imageFile', UserController.getUserImage);


module.exports = api;