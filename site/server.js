var app = require('./app.js');
var express = require('express');
var path = require('path');
var qs = require('query-string');

var expressApp = express();

expressApp.use(function (req, res, next) {
    console.log(req.url);
    next();
});
expressApp.use(express.static(path.join(__dirname, 'public/')))

expressApp.get('/login', app.login);
expressApp.get('/logout', app.logout);
expressApp.get('/login-callback', app.loginCallback);
expressApp.get('/room', app.room);
expressApp.post('/dj', app.dj);
expressApp.post('/listen', app.listen);

expressApp.listen(8080);
