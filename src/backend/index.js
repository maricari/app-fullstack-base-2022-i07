//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

// devices (in memory)
var devices = require('./datos.js')

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    console.log(devices)
    res.send(JSON.stringify(devices)).status(200);
});

app.post('/devicesNew/', function(req, res) {
    console.log('ALTA' + req.body)
    res.status(200);
});

app.delete('/devicesDelete/', function(req, res) {
    id = req.params.id
    console.log('borrar el id ' + id)
    res.status(200);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
