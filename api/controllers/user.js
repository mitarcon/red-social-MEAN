'use strict'

var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');
var jwtService = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
// var i18n = require('i18n');

var fs = require('fs');
var path = require('path');

var urlUserImg = './uploads/users';

//Metodo de prueba
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

function loginUser(req, res){
    var params = req.body;

    var _email = params.email;
    var _password = params.password;

    User.findOne({
        email: _email
    }, (err, user) => {
        if (err)
            return res.status(500)
            .send({
                message: res.__n('error.find.user', 1)
            });
        
        if(user){
            bcrypt.compare(_password, user.password,
            (err, check) =>{
                if (err)
                    return res.status(500)
                    .send({
                        message: res.__('error.bcrypt')
                    });

                if(check){
                    user.password = undefined;
                    
                    if(params.needToken){
                        return res.status(200)
                        .send({
                            token: jwtService.createToken(user)
                        });
                    }else{
                        return res.status(200)
                        .send({
                            user: user
                        });
                    }
                }else{
                    return res.status(500)
                    .send({
                        message: res.__('error.dont.login')
                    });                    
                }
            });
        }else{
            return res.status(200)
            .send({
                message: res.__('error.user.dont.exist')
            });
        }
    });
}

function getUser(req, res){
    var userId = req.params.id;
    
    if(!userId)
        return res.status(200)
            .send({
                message: res.__('error.param.mistake')
            });

    User.findById(userId,
    (err, user) => {
        if(err)
            return res.status(500)
                .send({
                    message: res.__('error.interval.server')
                });
                
        if(!user)
            return res.status(404)
                .send({
                    message: res.__('error.user.dont.exist')
                });

        return res.status(200)
        .send({
            user: user
        });
    });
}

function getUsers(req, res){
    var identity_user_id = req.user.sub;
    var page = 1;
    var pageSize = 5;
    var query = req.query;
    
    var aux = parseInt(query.page);
    if(query.page && Number.isInteger(aux)){
        page = aux;
    }
    
    aux = parseInt(query.pageSize);
    if(query.pageSize && Number.isInteger(aux)){
        pageSize = aux;
    }

    User.find().paginate(page, pageSize,
    (err, users, total) => {
        if (err)
            return res.status(500)
            .send({
                message: res.__n('error.find.user', 2)
            });

        if (!users)
            return res.status(404)
            .send({
                message: res.__('dont.exist.users')
            });

        return res.status(200)
        .send({
            users,
            total,
            pages: Math.ceil(total/pageSize)
        });   
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var userUpdate = req.body;

    delete userUpdate.password;

    if(userId != req.user.sub){
        return res.status(500)
        .send({
            message: res.__n('error.find.user', 1)
        });        
    }

    User.findByIdAndUpdate(userId, userUpdate, {new: true},
    (err, userUpdated) => {
        if (err)
            return res.status(500)
            .send({
                message: res.__('error.interval.server')
            });
        
        if(!userUpdated)
             return res.status(500)
            .send({
                message: res.__('error.when.update.user')
            });

        if (userUpdated)
            return res.status(200)
            .send({
                user: userUpdated
            });
    });
}

function uploadImage(req, res){
    var userId = req.params.id;

    if(!req.files){
        return res.status(500)
        .send({
            message: res.__('error.upload.image')
        });        
    }

    var file_path = req.files.image.path;
    console.log("file_path ",file_path);
    if(userId != req.user.sub){
        removeFileFromPath(file_path);
        return res.status(500)
        .send({
            message: res.__n('error.find.user', 1)
        });        
    }

    var file_split = file_path.split('\\');
    var file_name = file_split[2];
    var ext_split = file_name.split("\.");
    var file_ext = ext_split[1];

    if(file_ext != 'jpg' &&
     file_ext != 'png' &&
     file_ext != 'jpeg' &&
     file_ext != 'gif'){

        removeFileFromPath(file_path);
        return res.status(500)
        .send({
            message: res.__('error.invalid.format')
        });    
    }

    User.findByIdAndUpdate(userId, {image: file_name}, {new: true},
    (err, userUpdated) => {
        if (err)
            return res.status(500)
            .send({
                message: res.__('error.interval.server')
            });
        
        if(!userUpdated)
             return res.status(500)
            .send({
                message: res.__('error.when.update.user')
            });

        if (userUpdated)
            return res.status(200)
            .send({
                user: userUpdated
            });
    });


}

function removeFileFromPath(filePath){
    fs.unlink(filePath, (err)=>{
        console.log("err ", err);
    });
}

function getUserImage(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = urlUserImg + "/" + imageFile;
    fs.exists(pathFile,
    (exist) => {
        console.log("log ",exist);
        if(exist)
            return res.sendFile(path.resolve(pathFile));
        else
            return res.status(404).send({
                message: res.__('error.image.doesnt.found')
            });
    });
}


module.exports ={
    home,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    urlUserImg,
    getUserImage
};