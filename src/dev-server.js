var express = require('express');
var app = express();
var router = express.Router();
var db = require('./db/db');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var path = require('path');
var config = require('../config/webpack.config.dev');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

app.use(logger('dev'));

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    historyApiFallback: true,
    hot: true, // Note: only CSS is currently hot reloaded
    publicPath: config.output.publicPath,
    quiet: false,
    stats: {
        colors: true,
        chunks: false
    },
    watchOptions: {
        ignored: /node_modules/
    }
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log
}));

router.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index-dev.html'));
});

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use('/db', db);

app.use('/', router);

var DEFAULT_PORT = process.env.PORT || 3083;

app.listen(DEFAULT_PORT, function() {
    console.log('listening on', DEFAULT_PORT);
});