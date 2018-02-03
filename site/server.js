var express = require('express');
var path = require('path');

var expressApp = express();

expressApp.use(express.static(path.join(__dirname, 'public/')))

expressApp.listen(8080);
