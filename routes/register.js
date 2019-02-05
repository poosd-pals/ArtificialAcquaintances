var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const bcrypt = require("bcrypt");

// connection string can be accessed by using "mongo.ConnectionString"
const mongo = require("./mongo");
const url = mongo.ConnectionString;

// GET register page.
router.get('/', (req, res) => {
	if (req.session.uid) {
		req.redirect("/contacts");
	}
	else {
		var error = req.session.hasError;
		var errorMsg = req.session.errorMessage;

		req.session.destroy();

		res.render('register', {hasError: error, errorMessage: errorMsg});
	}
});

// time to make an account
router.post('/', (req, res) => {
	mongoose.connect(url, (err) => {
		if (err) {
			mongoose.disconnect();
			throw err;
		}

		User.findOne({
			email: req.body.email
		}, (err, user) => {
			if (err) {
				mongoose.disconnect();
				throw err;
			}

			// only register account if no user with that email exists
			if (!user) {
				var user = User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});

				user.save((err) => {
					if (err) {
						mongoose.disconnect();
						throw err;
					}

					mongoose.disconnect();

					req.session.hasRegisterSuccess = true;
					res.redirect('/');
				});
			}
			else {
				mongoose.disconnect();

				req.session.hasError = true;
				req.session.errorMessage = "Account with that email already exists!"
				res.redirect('/register');
			}
		});
	});
});

module.exports = router;
