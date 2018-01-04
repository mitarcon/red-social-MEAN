'use strict'

var express = require('express');
var md_auth = require('../middelwares/authenticated');

var FollowController = require('../controllers/follow');


var api = express.Router();


api.get('/test', md_auth.ensureAuth, FollowController.test);
api.get('/me', md_auth.ensureAuth, FollowController.getFollowingMe);
api.post('', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/:id', md_auth.ensureAuth, FollowController.getFollowingUser);


module.exports = api;
