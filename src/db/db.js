var express = require('express');
var router = express.Router();
var md5 = require('md5');

const config = require('./config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
    },
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

router.post('/login', function(req, res) {
	const username = req.body.username;
	const password = md5(req.body.password)
	
	sequelize.query(
		'SELECT * FROM Person WHERE username = :username AND password = :password',
		{ replacements: { username, password }, type: sequelize.QueryTypes.SELECT }
	).then(users => {
		res.send(users.length === 1 && users[0].username === username)
	})
});

module.exports = router;