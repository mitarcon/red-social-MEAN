'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var i18n = require('i18n');


var app = express();

//Rutas
var user_routes = require('./routes/user');

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
i18n.configure({
    locales:['es', 'en'],
    directory: __dirname + '/locales',
    defaultLocale: 'es'
});
app.use(i18n.init);



//cors

//rutas
app.use('/api', user_routes);


//exportar
module.exports = app;