var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

User = require('./schemas.js');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET contact manager page for logged in user. */
router.get('/', function(req, res, next) {
	mongoose.connect(url, (err) => {
		if(err) {
			mongoose.disconnect();
			throw err;
		}
	
		User.findOne({ 
			_id: req.session.uid
		}, (err, user) => {
            mongoose.disconnect();

            if(err) {
                throw err;
            }

            if(!user) {
			    req.session.uid = "";
			    req.session.hasError = true;
			    req.session.errorMessage = "There was a problem grabbing your contacts, please login again.";
			    res.redirect("/");
            }

            else {
                res.render('contacts', {
                    name: user.name,
                    contacts: user.contacts
                });
            }
		});
	});
});

// remove session data and redirect to login page
router.get('/logout', (req, res, next) => {
	req.session.destroy();
	res.redirect("/");
});

module.exports = router;
