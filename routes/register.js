var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const bcrypt = require("bcrypt");

// connection string can be accessed by using "mongo.ConnectionString"
const mongo = require("./mongo");
const url = mongo.ConnectionString;

// GET register page.
router.get('/', (req, res) => {
    console.log("in the router.get");
	var error = req.session.hasError;
	var errorMsg = req.session.errorMessage;
	var regSuccess = req.session.registrationHasSucceded;

    res.render('register', { hasError: error, errorMessage: errorMsg, hasRegisterSuccess: regSuccess });
});

// time to make an account
router.post('/', (req, res) => {
	mongoose.connect(url, (err) => {
		if (err) {
			mongoose.disconnect();
			throw err;
		}

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

			req.session.hasRegisterSuccess = true;
			res.redirect('/');
		});
	});
});

module.exports = router;
