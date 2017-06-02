var express = require('express');
var router = express.Router();
var server = require('http').Server(express());
var io = require('socket.io')(server);
var user = require('../models/user');
var multer = require('multer');

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        res.render('pages/login', {
            message: req.flash('message')
        });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('pages/signup', {
            message: req.flash('message')
        });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/signup',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('pages/dashboard', {
            user: req.user
        });
    });
    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get("/camera", function (req, res) {
        res.render("pages/camera");
    });
    router.get("/video", function (req, res) {
        res.render("pages/video");
    });
    router.get("/notes", function (req, res) {
        res.render("pages/notas", {
            user: req.user
        });
    });
    router.get("/user", function (req, res) {
        res.render("pages/user", {
            user: req.user
        });
    });

    /*router.post("/user", multer({
        dest: '../public/images'
    }).single('upl'), function (req, res) {
        console.log(req.forms);
        res.status(204).end();
    });*/

    return router;
}