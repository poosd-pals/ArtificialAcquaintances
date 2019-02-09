var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const bcrypt = require("bcrypt");

User = require('./schemas/UserSchema');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.uid) {
		console.log("uid is not blank!");
		res.redirect("/contacts");
	}
	else {
		var error = req.session.hasError;
		var errorMsg = req.session.errorMessage;
		var regSuccess = req.session.hasRegisterSuccess;

		req.session.destroy();

		res.render('index', {hasError: error, errorMessage: errorMsg, hasRegisterSuccess: regSuccess});
	}
});

/* login attempt */
router.post('/', function(req, res) {

	mongoose.connect(url, (err) => {
		if(err) {
			mongoose.disconnect();
			throw err;
		}

		User.findOne({
			email: req.body.email
		}, (err, user) => {
			if(err) {
				mongoose.disconnect();
				throw err;
			}

			if(!user) {
				req.session.hasError = true;
				req.session.errorMessage = "User with that email does not exist!";
				
				mongoose.disconnect();
				res.redirect('/');
				return;
			}

			user.comparePassword(req.body.password, (err, isMatch) => {
				mongoose.disconnect();

				if (err) throw err;

				if(isMatch) {
					req.session.uid = user._id;
					req.session.displayName = user.name;

					res.redirect('/contacts');
				}
				else {
					req.session.hasError = true;
					req.session.errorMessage = "Incorrect password!";

					res.redirect('/');
				}
			});
		});
	});
});

module.exports = router;
