var app = require('./app.js');
var express = require('express');
var path = require('path');

var expressApp = express();

expressApp.use(express.static(path.join(__dirname, 'public/')))

expressApp.get('/login', app.login);
expressApp.get('/login-callback', app.loginCallback);
expressApp.get('/room', app.room);
expressApp.post('/dj', app.dj);
expressApp.post('/listen', app.listen);

expressApp.listen(8080);
