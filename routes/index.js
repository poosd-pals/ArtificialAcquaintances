var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const bcrypt = require("bcrypt");

User = require('./schemas.js');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET home page. */
router.get('/', function(req, res, next) {
    var error = req.session.hasError;
    var errorMsg = req.session.errorMessage;
    var regSuccess = req.session.hasRegisterSuccess;

    req.session.destroy();

    res.render('index', { hasError: error, errorMessage: errorMsg, hasRegisterSuccess: regSuccess });
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
				console.log("we connected!");

				req.session.hasError = true;
				req.session.errorMessage = "User with that email does not exist!";
				
				mongoose.disconnect();

				res.redirect('/');

				return;
			}

			console.log(user._id);

			user.comparePassword(req.body.password, (err, isMatch) => {
				if(err) {
					mongoose.disconnect();
					throw err;
				}

				console.log(req.body.password);
				console.log(isMatch);

				if(isMatch) {
					// TODO: add user data to session
					req.session.uid = user._id;
					mongoose.disconnect;

					res.redirect('/contacts');
				}
				else {
					req.session.hasError = true;
					req.session.errorMessage = "Incorrect password!";

					mongoose.disconnect;

					res.redirect('/');
				}
			});
		});
	});
});

module.exports = router;
