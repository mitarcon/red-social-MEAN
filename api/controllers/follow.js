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

function saveFollow (req, res){
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


module.exports = {
    test,
    saveFollow
};
