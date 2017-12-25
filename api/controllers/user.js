'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');
// var i18n = require('i18n');


function home (req, res){
    // i18n.setLocale(res, 'en');
    res.status(200)
    .send({
        message: res.__('hello')
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
        _user.nick = params.nick.toLowerCase();
        _user.email = params.email.toLowerCase();
        _user.role = 'ROLE_USER';
        _user.image = null;

        //Buscar si el usuario existe
        User.findOne({
            "$or": [
                { email: _user.email },
                { nick: _user.nick }
            ]
        }).exec(
            (err, users) => {
                if (err)
                    return res.status(500)
                    .send({
                        message: res.__('error.add.user')
                    });
                
                if(users){
                    return res.status(500)
                        .send({
                            message: res.__('error.user.exist')
                        });
                }else{

                    //Encriptar contraseña
                    bcrypt.hash(params.password, null, null,
                    (err, hash) => {
                        _user.password = hash;

                        if(err){
                            return res.status(500)
                            .send({
                                message: res.__('error.save.user')
                            });
                        }

                        _user.save(
                        (err, userStored) => {
                            if(err){
                                return res.status(500)
                                .send({
                                    message: res.__('error.save.user')
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
                                    message: res.__('error.add.user')
                                });
                            }
                        });
                    })                    
                }
        });
    }else{
        return res.status(200)
        .send({
            message: res.__('need.all.data')
        });
    }


}

module.exports ={
    home,
    saveUser
};