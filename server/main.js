//Variables que inician los modulos de la aplicacion

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 8000);

var http = require('http');
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("server listening on port " + app.get('port'));
}); //Creamos el servidor en el puerto que le asignamos

var io = require('socket.io')(server);
var ruta = require('../routes/routes.main');
var PythonShell = require('python-shell');

var debug = require('debug')('passport-mongo');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var dbConfig = require('../db');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var initPassport = require('../passport/init');
var schema_user = require('../models/user');
var routes = require('../routes/routes.main')(passport);
var usr;
var spawn = require('child_process').spawn;
var proc;
var fs = require('fs');

app.set("view engine", "ejs");

mongoose.connect(dbConfig.url); //creamos la conexion con la base de datos
app.use(express.static('public')); //capeta des de la qual nos vamos a mover

app.use(bodyParser.json());

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//necesario para el login de usuario
app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Iniciamos el modulo passport
initPassport(passport);

app.use("/", routes);

/// error 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//registro de otro error
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error: err
        });
    });
}
//var sockets = {};

//se realiza la conexion con la aplicacion
io.on('connection', function (socket) {
    var u = require('../passport/login').usr; //recogemos el usuario conectado
    usr = u;
    var p = "";
    console.log('Alguien se ha conectado con Sockets');

    //evento para emitir los datos en tiempo real
    socket.on("get_data", function (data) {
        var temperature = new PythonShell('python_files/temperature.py');
        var pressure = new PythonShell('python_files/pressure.py');
        var humidity = new PythonShell('python_files/humidity.py');
        var t, pr, h, la, lo, info;

        temperature.on('message', function (message) {
            t = message;
            console.log(message);
        });
        pressure.on('message', function (message) {
            pr = message;
            console.log(message);
        });
        humidity.on('message', function (message) {
            h = message;
            console.log(message);
            info = {
                temperature: t,
                pressure: pr,
                humidity: h
            }
            console.log(info);
            socket.emit("let_data", info);
        });
    });

    //evento que recoge la posicion gps para los mapas
    socket.on('get_gps', function (data) {
        var gps = {};
        var glat = new PythonShell('python_files/latitude.py');
        var glong = new PythonShell('python_files/longuitud.py');
        var latitude, longuitud;
        glat.on('message', function (message) {
            latitude = message;
        });
        glong.on('message', function (message) {
            longuitud = message;
            gps = {
                lat: latitude,
                lng: longuitud
            }
            socket.emit('gps', gps);
        });
    });

    //evento que nos hace la foto
    socket.on('camera', function (data) {
        console.log('Haciendo foto');
        //iniciamos todos los archivos python para la ejecucion de la foto
        var pyshell = new PythonShell('python_files/camera.py');
        var temperature = new PythonShell('python_files/temperature.py');
        var pressure = new PythonShell('python_files/pressure.py');
        var humidity = new PythonShell('python_files/humidity.py');
        var t, pr, h, la, lo; //variables para recoger los datos
        var latitude = new PythonShell('python_files/latitude.py');
        var longuitud = new PythonShell('python_files/longuitud.py');
        var save_image = new schema_user();
        pyshell.on('message', function (message) {
            p = message;
            console.log(u);
            console.log(p);
            socket.emit('final', "Has hecho una foto");
            schema_user.findOne({
                'username': u
            }, function (err, user) {
                user.images.path.push(p);
                user.images.latitude.push(la);
                user.images.longuitud.push(lo);
                user.images.humidity.push(h);
                user.images.presion.push(pr);
                user.images.temperature.push(t);
                user.save();
            }); //guardamos en base de datos
        });
        latitude.on('message', function (message) {
            la = message;
            console.log(message);
        });
        longuitud.on('message', function (message) {
            lo = message;
            console.log(message);
        });
        temperature.on('message', function (message) {
            t = message;
            console.log(message);
        });
        pressure.on('message', function (message) {
            pr = message;
            console.log(message);
        });
        humidity.on('message', function (message) {
            h = message;
            console.log(message);
        });
    });

    //evento que nos hace el video
    socket.on('video', function (data) {
        //iniciamos todos los archivos python para la ejecucion del video
        var temperature = new PythonShell('python_files/temperature.py');
        var pressure = new PythonShell('python_files/pressure.py');
        var humidity = new PythonShell('python_files/humidity.py');
        var latitude = new PythonShell('python_files/latitude.py');
        var longuitud = new PythonShell('python_files/longuitud.py');
        var name = new PythonShell('python_files/nombre_video.py');
        var t, pr, h, la, lo; //variables para recoger los datos
        console.log('Grabando video');
        var video = new PythonShell('python_files/video.py');
        video.on('message', function (message) {
            p = message;
            console.log(u);
            console.log(p);
            socket.emit('final_video', "Has hecho un video"); //se emite el evento que saca mensaje por pantalla
            schema_user.findOne({
                'username': u
            }, function (err, user) {
                user.videos.path.push(p);
                user.videos.latitude.push(la);
                user.videos.longuitud.push(lo);
                user.videos.humidity.push(h);
                user.videos.presion.push(pr);
                user.videos.temperature.push(t);
                user.save();
            }); //guardamos en base de datos
        });
        latitude.on('message', function (message) {
            la = message;
            console.log(message);
        });
        longuitud.on('message', function (message) {
            lo = message;
            console.log(message);
        });
        temperature.on('message', function (message) {
            t = message;
            console.log(message);
        });
        pressure.on('message', function (message) {
            pr = message;
            console.log(message);
        });
        humidity.on('message', function (message) {
            h = message;
            console.log(message);
        });
    });

    //evento para actualizar la informacion de usuario
    socket.on('update_profile', function (data) {
        schema_user.findOne({
            'username': u
        }, function (err, user) {
            user.company = data.company;
            user.email = data.email;
            user.first_name = data.first_name;
            user.last_name = data.last_name;
            user.address = data.address;
            user.city = data.city;
            user.country = data.country;
            user.about = data.about;
            user.username = data.username;
            user.zip = data.zip;
            u = data.username;
            user.save();
        }); //guardamos en base de datos
    });

    //evento para agregar una nota
    socket.on('agregar_nota', function (data) {
        schema_user.findOne({
            'username': u
        }, function (err, user) {
            user.notas.titulo.push(data.titulo);
            user.notas.content.push(data.content);
            user.save();
        }); //guardamos en base de datos
    });

    /*socket.on('borrar_imagen', function (data) {
         console.log(data);
         schema_user.update({
                 username: u,
                 images: {
                     path: data
                 }
             }, {
                 $pull: {
                     images: {
                         latitude: "",
                         longuitud: "",
                         pressure: "",
                         humidity: "",
                         temperature: "",
                         path: ""
                     }
                 }
             }, {
                 safe: true
             },
             function (err, result) {}
         );

         /*schema_user.find({
             'username': u,
             'images.path': data
         }, function (err, user) {
             /*user.images.path.pull();
             user.images.latitude.pull();
             user.images.longuitud.pull();
             user.images.pressure.pull();
             user.images.humidity.pull();
             user.images.temperature.pull();*/
    //user.save();*/
    //}); //guardamos en base de datos
    /*socket.on('borrar_nota', function (data) {
        schema_user.findOne({
            'username': u
        }, function (err, user) {
            user.notas.titulo.pull(data.titulo);
            user.notas.content.pull(data.content);
            user.save();
        });
    });*/

    //Aqui empieza las lineas de streaming(mas explicacion en la documentacion)
    /* sockets[socket.id] = socket;
     console.log("Total clients connected : ", Object.keys(sockets).length);

     socket.on('disconnect', function () {
         delete sockets[socket.id];

         // no more sockets, kill the stream
         if (Object.keys(sockets).length == 0) {
             app.set('watchingFile', false);
             if (proc) proc.kill();
             fs.unwatchFile('public/stream/image_stream.jpg');
         }
     });

     socket.on('start-stream', function () {
         startStreaming(io);
     });*/
});

/*function stopStreaming() {
    if (Object.keys(sockets).length == 0) {
        app.set('watchingFile', false);
        if (proc) proc.kill();
        fs.unwatchFile('public/stream/image_stream.jpg');
    }
}

function startStreaming(io) {

    if (app.get('watchingFile')) {
        io.sockets.emit('liveStream', '/image_stream.jpg?_t=' + (Math.random() * 1000));
        return;
    }

    var args = ["-w", "1024", "-h", "720", "-o", "public/stream/image_stream.jpg", "-t", "999999999", "-tl", "20"];
    proc = spawn('raspistill', args);

    console.log('Watching for changes...');

    app.set('watchingFile', true);

    fs.watchFile('public/stream/image_stream.jpg', function (current, previous) {
        io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 1000));
    })

}*/

module.exports = app; //pasamos a otros archivos la variable que adquiere todos los datos de la aplicación