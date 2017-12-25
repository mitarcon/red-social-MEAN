'use stric'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_de_la_aplicacion_red_social_mean';


function createToken (user){
    var payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        surname: user.surname,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
}

module.exports ={
    createToken
};
