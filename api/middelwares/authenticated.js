'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = require('../util/jwt').secretKey;

function ensureAuth (req, res, next){
    if(!req.headers.authorization){
        return res.status(403)
        .send({
            message: res.__('error.header.doesnt.have.authentication')
        });
    }

    //Reemplazar ' p " por el caracter vacio
    var token = req.headers.authorization.replace(/['"']+/g, '');

    try {
        var payload = jwt.decode(token, secretKey);

        if(payload.exp <= moment().unix()){
            return res.status(401)
            .send({
                message: res.__('exception.token.expiration')
            });                  
        }
    } catch (error) {
         return res.status(403)
        .send({
            message: res.__('error.token.isnt.valid')
        });       
    }
    
    //Agregar usuario a req para ser usado en cualquier contralador
    req.user = payload;

    next();

}

module.exports ={
    ensureAuth
};
