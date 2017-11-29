var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

var DEFAULT_PORT = process.env.PORT || 3934;

router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build/', req.path));
});

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use('/', router);

var server = app.listen(DEFAULT_PORT, function() {
    console.log('listening on', DEFAULT_PORT);
});
