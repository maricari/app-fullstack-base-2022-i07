//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    utils.query("select * from Devices", function(err, respuesta){
          if (err) {
            res.send(err).status(400);
            return;
          }
          res.send(respuesta);
    } );
});


app.post('/devicesNew/', function(req, res) {
    type = req.body.type
    name = req.body.name
    description = req.body.description
    state_type = req.body.state_type
 
    query = "insert into Devices (type, name, description, state_type) values (?,?,?,?)"
    utils.query(query, [type, name, description, state_type],function(err, respuesta){
        if (err) {
          res.send(err).status(400);
          return;
        }
        // res.send("Dispositivo dado de alta correctamente.");
        res.status(200);
    } );
});

app.put('/devicesChange/', function(req, res) {
    id = req.body.id
    state = req.body.status
    intensidad = req.body.intensidad

    utils.query("update Devices set state=?, intensidad=? where id=?", [state, intensidad, id],function(err, respuesta){
        if (err) {
          res.send(err).status(400);
          return;
        }
        // res.send("Estado actualizado correctamente.");
        res.status(200);
    } );
});

app.delete('/devicesDelete/', function(req, res) {
    id = req.body.id

    utils.query("delete from Devices where id=?", [id],function(err, respuesta){
        if (err) {
          res.send(err).status(400);
          return;
        }
        // res.send("Dispositivo eliminado correctamente.");
        res.status(200);
    } );
});


app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================
