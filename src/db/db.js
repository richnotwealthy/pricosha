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
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

// check password and login
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

// check if username already exists and create new user
router.post('/createAccount', function(req, res) {
	const { username, first_name, last_name } = req.body
	const password = md5(req.body.password)

	sequelize.query(
		'SELECT username FROM Person',
		{
			type: sequelize.QueryTypes.SELECT
		}
	).then(users => {
		if (users.indexOf(username) === -1) {
			sequelize.query(
				'INSERT INTO `Person` (`username`, `first_name`, `last_name`, `password`) VALUES (:username, :first_name, :last_name, :password)',
				{
					replacements: { username, first_name, last_name, password },
					type: sequelize.QueryTypes.INSERT
				}
			).then(newPerson => {
				res.send(true)
			})
			res.send(true)
		} else {
			res.send(false)
		}
	})
});

// get content that user can view
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

// get more info about a content item
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

router.post('/getTags', function(req, res) {
	const username_taggee = req.body.username

	sequelize.query(
		'SELECT Content.id, Tag.username_tagger, Content.file_path, Content.content_name, Tag.timest FROM Tag JOIN Content ON Tag.id = Content.id WHERE username_taggee = :username_taggee AND status != 1',
		{
			replacements: { username_taggee },
			type: sequelize.QueryTypes.SELECT
		}
	).then(tags => {
		res.json(tags)
	})
})

router.post('/acceptTag', function(req, res) {
	const { id, username_tagger, username_taggee } = req.body

	sequelize.query(
		'UPDATE `Tag` SET `status` = 1 WHERE `Tag`.`id` = :id AND `Tag`.`username_tagger` = :username_tagger AND `Tag`.`username_taggee` = :username_taggee',
		{
			replacements: { id, username_tagger, username_taggee },
			type: sequelize.QueryTypes.UPDATE
		}
	).then(tag => {
		res.json(tag)
	})
})

router.post('/rejectTag', function(req, res) {
	const { id, username_tagger, username_taggee } = req.body

	sequelize.query(
		'DELETE FROM `Tag` WHERE `Tag`.`id` = :id AND `Tag`.`username_tagger` = :username_tagger AND `Tag`.`username_taggee` = :username_taggee',
		{
			replacements: { id, username_tagger, username_taggee },
			type: sequelize.QueryTypes.DELETE
		}
	).then(tag => {
		res.json(tag)
	})
})

// get friendgroups that a user owns
router.post('/friendGroups', function(req, res) {
	const username = req.body.username

	sequelize.query(
		'SELECT group_name, description FROM FriendGroup WHERE username = :username',
		{
			replacements: { username: username },
			type: sequelize.QueryTypes.SELECT
		}
	).then(groups => {
		res.json(groups)
	})
})

// get friends from a friend group
router.post('/friends', function(req, res) {
	const { username_creator, group_name } = req.body

	sequelize.query(
		'SELECT first_name, last_name, username FROM Member NATURAL JOIN Person WHERE username_creator = :username_creator AND group_name = :group_name',
		{
			replacements: { username_creator: username_creator, group_name: group_name },
			type: sequelize.QueryTypes.SELECT
		}
	).then(friends => {
		res.json(friends)
	})
})

// get people not in friends list for user
router.post('/otherPeople', function(req, res) {
	const { username, group_name } = req.body

	sequelize.query(
		'SELECT username, first_name, last_name FROM Person WHERE username != :username AND username NOT IN (SELECT username FROM Member WHERE username_creator = :username AND group_name = :group_name)',
		{
			replacements: { username, group_name },
			type: sequelize.QueryTypes.SELECT
		}
	).then(people => {
		res.json(people)
	})
})

// get all people except user
router.post('/allPeople', function(req, res) {
	const { username } = req.body

	let query

	if (username) query = 'SELECT username, first_name, last_name FROM Person WHERE username != :username'
	else query = 'SELECT username, first_name, last_name FROM Person'

	sequelize.query(
		query,
		{
			replacements: { username: username },
			type: sequelize.QueryTypes.SELECT
		}
	).then(people => {
		res.json(people)
	})
})

router.post('/addFriend', function(req, res) {
	const { username, group_name, username_creator } = req.body

	sequelize.query(
		'INSERT INTO `Member` (`username`, `group_name`, `username_creator`) VALUES (:username, :group_name, :username_creator)',
		{
			replacements: { username, group_name, username_creator },
			type: sequelize.QueryTypes.INSERT
		}
	).then(newMember => {
		res.json(newMember)
	})
})

router.post('/addFriendGroup', function(req, res) {
	const { username, group_name, description, person } = req.body

	sequelize.query(
		'INSERT INTO `FriendGroup` (`username`, `group_name`, `description`) VALUES (:username, :group_name, :description)',
		{
			replacements: { username, group_name, description },
			type: sequelize.QueryTypes.INSERT
		}
	).then(newFG => {
		sequelize.query(
			'INSERT INTO `Member` (`username`, `group_name`, `username_creator`) VALUES (:username, :group_name, :username_creator)',
			{
				replacements: { username: person, username_creator: username, group_name },
				type: sequelize.QueryTypes.INSERT
			}
		).then(newMember => {
			res.json(newMember)
		})
	})
})

router.post('/postContent', function(req, res) {
	const { username, caption, path, isPublic, groups } = req.body

	sequelize.query(
		'INSERT INTO `Content` (`id`, `username`, `timest`, `file_path`, `content_name`, `public`) VALUES (NULL, :username, CURRENT_TIMESTAMP, :path, :caption, :isPublic)',
		{
			replacements: { username, caption, path, isPublic },
			type: sequelize.QueryTypes.INSERT
		}
	).then(newContent => {
		const newId = newContent[0]

		groups.forEach(t => {
			sequelize.query(
				'INSERT INTO `Share` (`id`, `group_name`, `username`) VALUES (:newId, :group, :username)',
				{
					replacements: { newId, group: t, username },
					type: sequelize.QueryTypes.INSERT
				}
			)
		})
	})
})

router.post('/addComment', function(req, res) {
	const { id, username, comment_text } = req.body

	sequelize.query(
		'INSERT INTO `Comment` (`id`, `username`, `comment_text`) VALUES (:id, :username, :comment_text)',
		{
			replacements: { id, username, comment_text },
			type: sequelize.QueryTypes.INSERT
		}
	).then(newComment => {
		res.json(newComment)
	})
})

router.post('/deleteComment', function(req, res) {
	const { id, username, timest } = req.body

	sequelize.query(
		'DELETE FROM `Comment` WHERE `Comment`.`id` = :id AND `Comment`.`username` = :username AND `Comment`.`timest` = :timest',
		{
			replacements: { id, username, timest },
			type: sequelize.QueryTypes.DELETE
		}
	).then(com => {
		res.json(com)
	})
})

router.post('/addTag', function(req, res) {
	const { id, username_tagger, username_taggee } = req.body

	sequelize.query(
		'INSERT INTO `Tag` (`id`, `username_tagger`, `username_taggee`, `status`) VALUES (:id, :username_tagger, :username_taggee, :status)',
		{
			replacements: { id, username_tagger, username_taggee, status: username_taggee === username_tagger },
			type: sequelize.QueryTypes.INSERT
		}
	).then(newTag => {
		res.json(newTag)
	})
})

module.exports = router;