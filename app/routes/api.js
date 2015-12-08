var User = require("../model/user");
var Story = require('../model/story');
var config = require("../../config");
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');


function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});
	return token;
}

module.exports = function(app, express) {

	var api = express.Router();

	api.post('/signup', function(req, res){

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		token = createToke(user);

		user.save(function(err) {
			if (err) {
				res.send(err);
				return;
			}
			res.json({ 
				success: true,
				message: "User has been created",
				token: token
			});
		});
	});

	api.get('/users', function (req,res) {
		User.find({}, function(err, users){
			if (err) {
				res.send(err);
				return;
			}
			res.json(users);
		});
	})

	api.post('/login', function(req,res){
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user){
			if (err) throw err;
			if (!user) {
				res.send({ message: "User does not exist"});
			} else if (user) {
				var validPassword = user.comparePassword(req.body.password);

				if (!validPassword) {
					res.send({ message: "Invaid Password"});
				} else {

					// token
					var token = createToken(user);
					res.json({
						succsess: true,
						message: "Succesfuly login",
						token: token
					});
				}
			}
		})
	});

	// Middleware (Login)
	api.use(function(req,res, next){
		console.log("somebody just came to our app!");
		var token = req.body.token || req.params['token'] || req.headers['x-access-token'];

		console.log("Token:" + token);
		// check if token exists
		if (token) {
			jsonwebtoken.verify(token, secretKey, function(err, decoded) {
				if (err) {
					re.status(403).send( {success: false, messsage: "Failed to authenticate user"});
				} else {
					req.decoded = decoded;

					next();
				}
			})
		} else {
			res.status(403).send({success: false, mesage: "No token provided"});
		}
	});

	api.route('/')
		.post(function (req, res) {
			var story = new Story({
				creator: req.decoded.id,
				content: req.body.content,

			})
			story.save(function(err) {
				if (err) {
					res.send(err);
					return
				} 
				res.json({ message: "New story created" });
			})
		})
		.get(function(req, res) {
			Story.find({ creator: req.decoded.id }, function (err, stories) {
				if (err) {
					res.send(err);
					return
				} 
				res.json(stories);
			})
		})
	api.get('/me', function(req,res) {
		res.json(req.decoded);
	})

	return api;
}