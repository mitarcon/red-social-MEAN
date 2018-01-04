'use strict'

// var fs = require('fs');
// var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../model/user');
var Follow = require('../model/follow');

function test(req, res){
    return res.status(200).send({
        message: 'Respuesta de prueba'
    });
}

function saveFollow(req, res){
    var params = req.body;

    var _follow = new Follow();
    _follow.user = req.user.sub;
    _follow.followed = params.followed;

    _follow.save((err, followedStored) => {
        if (err)
            return res.status(500).send({
                message: res.__('error.save.follow')
            });

        if (!followedStored)
            return res.status(404).send({
                message: res.__('error.save.follow.dont.find')
            });

        return res.status(200).send({
            follow: followedStored
        });

    })
}

function deleteFollow(req, res){
    var userId = req.user.sub;
    var followUserId = req.params.id;

    Follow.findOneAndRemove({
        user: userId,
        followed: followUserId
    }, (err, followDeleted) => {
        if (err)
            return res.status(500).send({
                message: res.__('error.delete.follow')
            });

        if(!followDeleted)
            return res.status(404).send({
                message: res.__('error.delete.follow.dont.find')
            });

        return res.status(200).send({
            message: res.__('follow.delete.successful')
        });
    });
} 

function getFollowingUser(req, res){
    var userId = req.params.id;

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

    Follow.find({
        user: userId
    })
    .populate('followed')
    .populate('user', 'nick')
    .paginate(page, pageSize,
    (err, follows, total) => {
        if (err)
            return res.status(500).send({
                message: res.__('error.delete.follow')
            });   

        return res.status(200).send({
            follows,
            total,
            pages: Math.ceil(total/pageSize)
        });            
    });

}


module.exports = {
    test,
    saveFollow,
    deleteFollow,
    getFollowingUser
};
