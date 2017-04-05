var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var lims = require('./routes/lims');

var db = mongoose.connect('webtechdevops.centralindia.cloudapp.azure.com:51003/lims');

var app = express();

var port = process.env.port || 9890;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
});

//lims2.0 apis route
app.use('/lims', lims);



app.listen(port, function () {
    console.log('running on port: ' + port);
});