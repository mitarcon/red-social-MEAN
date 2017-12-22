'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');


function home (req, res){
    res.status(200)
        .send({
            message: 'Get de usuario'
        });
}

function saveUser (req, res){
    var params = req.body;
    
    if(undefined != params.name && undefined != params.surname
        && undefined != params.nick && undefined != params.email
        && undefined != params.password){
        
        
        var _user = new User();
        _user.name = params.name;
        _user.surname = params.surname;
        _user.nick = params.nick;
        _user.email = params.email;
        _user.role = 'ROLE_USER';
        _user.image = null;

        bcrypt.hash(params.password, null, null,
        (err, hash) => {
            _user.password = hash;

            if(err){
                return res.status(500)
                .send({
                    message: 'Error al guardar el usuario'
                });
            }

            _user.save(
            (err, userStored) => {
                if(err){
                    return res.status(500)
                    .send({
                        message: 'Error al guardar el usuario'
                    });
                }
                if(userStored){
                    return res.status(200)
                    .send({
                        user: userStored
                    });
                }else{
                    return res.status(404)
                    .send({
                        message: 'No se logro registrar el usuario'
                    });
                }
            });
        })

    }else{
        return res.status(200)
        .send({
            message: 'Enviar todos los datos necesarios'
        });
    }


}

module.exports ={
    home,
    saveUser
};