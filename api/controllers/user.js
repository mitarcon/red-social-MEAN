'use strict'

var User = require('../model/user');

function home (req, res){
    res.status(200)
        .send({
            message: 'Get de usuario'
        });
}

module.exports ={
    home
};