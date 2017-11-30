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
		{
			replacements: { username: username, password: password },
			type: sequelize.QueryTypes.SELECT
		}
	).then(users => {
		res.send(users.length === 1 && users[0].username === username)
	})
});

router.post('/userContent', function(req, res) {
	const user = req.body.user;

	sequelize.query(
		'SELECT username, id, timest, file_path, content_name, public, first_name, last_name FROM Content NATURAL JOIN Person WHERE username = :user OR public != 0 OR id IN (SELECT id FROM Share WHERE (group_name, username) IN (SELECT group_name, username_creator AS username FROM Member WHERE username = :user))',
		{
			replacements: { user: user },
			type: sequelize.QueryTypes.SELECT
		}
	).then(content => {
		res.json(content)
	})
});

router.post('/contentInfo', function(req, res) {
	const id = req.body.id;

	sequelize.query(
		'SELECT * FROM Tag WHERE id = :id AND status != 0',
		{
			replacements: { id: id },
			type: sequelize.QueryTypes.SELECT
		}
	).then(tags => {
		sequelize.query(
			'SELECT * FROM Comment WHERE id = :id',
			{
				replacements: { id: id },
				type: sequelize.QueryTypes.SELECT
			}
		).then(comments => {
			res.json({ comments: comments, tags: tags })
		})
	})
})

module.exports = router;