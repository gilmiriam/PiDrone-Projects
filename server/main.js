var express = require('express');
var app = express();
//var server = require('http').Server(app);
var io = require('socket.io')(server);
var ruta = require('../routes/routes.main');
var PythonShell = require('python-shell');
var http = require('http');

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
var routes = require('../routes/routes.main')(passport);
app.set('port', process.env.PORT || 4000);
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("server listening on port " + app.get('port'));
});

app.set("view engine", "ejs");

mongoose.connect(dbConfig.url);

app.use(express.static('public'));

//app.use('/', ruta);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// TODO - Why Do we need this key ?
app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Initialize Passport
initPassport(passport);

app.use("/", routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error', {
            message: err.message,
            error: err
        });
    });
}
io.on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets');
    socket.on('leds', function () {
        console.log('MosTrando leds!!!!!!!');
        PythonShell.run('python_files/matrix_led2.py', function (err) {
            if (err) throw err;
        });
    });
    socket.on('camera', function () {
        console.log('Haciendo foto');
        PythonShell.run('python_files/camera.py', function (err) {
            if (err) throw err;
        });
    });
    socket.on('video', function () {
        console.log('Grabando video');
        /*var opciones = {
            mode: 'text',
            pythonPath: '/ruta/a/Python', // Solo necesario si no es el directorio por defecto
            //pythonOptions: , //< Array con flags en String > , // ['-u'], por ejemplo
            args: [firstName, lastName], // [sys.argv[1], sys.argv[2], (...) ]
        }*/
        PythonShell.run('python_files/video.py', function (err) {
            if (err) throw err;
        });
    });
});

module.exports = app;