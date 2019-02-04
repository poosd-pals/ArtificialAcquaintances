var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

User = require('./schemas.js');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET contact manager page for logged in user. */
router.get('/', function(req, res, next) {
    // TODO: pass user data from session to render
    // pass whole mongo object?
    // also need to pass contacts
	mongoose.connect(url, (err) => {
		if(err) {
			mongoose.disconnect();
			throw err;
		}
	
		User.findOne({ 
			_id: req.session.uid
		}, (err, user) => {
			if(err) {
				mongoose.disconnect();
				throw err;
			}

			mongoose.disconnect();
			res.render('contacts', {
				name: user.name
			});
		});
	});
});

module.exports = router;
