'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middelwares/authenticated');

var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: UserController.urlUserImg});

// api.get('/user', md_auth.ensureAuth, UserController.home);
api.get('', md_auth.ensureAuth, UserController.getUsers);
api.post('',  md_auth.ensureAuth, UserController.saveUser);
api.get('/:id', md_auth.ensureAuth, UserController.getUser);
api.put('/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/:id/upload/image', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.post('/action/login', UserController.loginUser);
api.get('/action/image/:imageFile', UserController.getUserImage);


module.exports = api;