'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red-social-mean', { useMongoClient: true })
    .then(
        () => {
            console.log("Conexión satisfactoria a la base de datos");

            //conecion al servidor
            app.listen(port,
                () => {
                    console.log("Servidor corriendo http://localhost:"+3800);
            });
        }
    )
    .catch(
        err => console.log(err)
    )