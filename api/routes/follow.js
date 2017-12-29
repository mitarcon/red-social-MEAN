'use strict'

var express = require('express');
var md_auth = require('../middelwares/authenticated');

var FollowController = require('../controllers/follow');


var api = express.Router();


api.get('/test', md_auth.ensureAuth, FollowController.test);
api.post('', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/:id', md_auth.ensureAuth, FollowController.deleteFollow)


module.exports = api;
