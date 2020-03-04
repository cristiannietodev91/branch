// server.js
var express = require('express');
var serveStatic = require('serve-static'); 
var cors = require('cors');
var history = require('connect-history-api-fallback');

var app = express();

app.use(history());
app.use(cors())
app.use(serveStatic(__dirname + "/dist")); 

var port = process.env.PORT || 5000;
app.listen(port); 
console.log('server started ' + port);