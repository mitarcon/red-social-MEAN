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



//cors

//rutas
app.use('/api', user_routes);

//Internacionalization
i18n.configure({
    locales:['es', 'en'],
    directory: __dirname + '/locales',
    defaultLocale: 'es'
});

//init i18n after cookie-parser
app.use(i18n.init);
console.log("--- ",i18n.__('hello'));


//exportar
module.exports = app;