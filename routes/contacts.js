var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

User = require('./schemas/UserSchema');
Contact = require('./schemas/ContactSchema');

const mongo = require("./mongo.json");
const url = mongo.ConnectionString;

/* GET contact manager page for logged in user. */
router.get('/', function(req, res, next) {
	mongoose.connect(url, (err) => {
		if(err) {
			mongoose.disconnect();
			throw err;
		}
	
		Contact.find({
			daddy: req.session.uid
		}, (err, contacts) => {
            mongoose.disconnect();

            if(err) {
                throw err;
            }

            if(!contacts) {
			    req.session.uid = "";
			    req.session.hasError = true;
			    req.session.errorMessage = "There was a problem grabbing your contacts, please login again.";
			    res.redirect("/");
            }

            else {
                res.render('contacts', {
                    name: req.session.displayName,
                    contacts: contacts
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

router.get('/search', (req, res, next) => {
	var search = req.query.search;

	mongoose.connect(url, (err) => {
		if (err) throw err;


		Contact.find({
			daddy: req.session.uid,
			$text: {$search: search}
		}).exec((err, docs) => {
			mongoose.disconnect();

			if (err) throw err;
			if (!docs) res.status(500).end();

			res.status(200).send(docs);
		});
	});
});

router.post('/add', (req, res, next) => {
    console.log(req.body);
	mongoose.connect(url, (err) => {
		var contact = Contact({
			daddy: req.session.uid,
			firstName: req.body.newFirstName,
			lastName: req.body.newLastName,
			phoneNumber: req.body.newPhone,
			email: req.body.newEmail,
			addressLineOne: req.body.newAddressOne,
			addressLineTwo: req.body.newAddressTwo,
			city: req.body.newCity,
			state: req.body.newState,
			zipcode: req.body.newZipcode
	    });

        contact.save((err) =>{
            if(err) {
                mongoose.disconnect();
                throw err;
            }

            mongoose.disconnect();
            res.redirect("/contacts");
        });
	});
});

module.exports = router;
