'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var i18n = require('i18n');


var app = express();

//Rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');

//middlewares
app.use(
    bodyParser.urlencoded(
        {
            extended: false
        }
    )
);
app.use(
    bodyParser.json()
);

//Internacionalization
// https://github.com/mashpie/i18n-node
i18n.configure({
    locales:['es', 'en'],
    directory: __dirname + '/locales',
    defaultLocale: 'es'
});
app.use(i18n.init);



//cors

//rutas
app.use('/api/user', user_routes);
app.use('/api/follow', follow_routes);


//exportar
module.exports = app;