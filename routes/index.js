var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");

// TODO: refactor firestore usages to MongoDB
// we need to nuke this firebase stuff
// const fb = require('fb');
// const db = fb.firestore();
// db.settings({ timestampsInSnapshots: true});

/* GET home page. */
router.get('/', function(req, res, next) {
    var error = req.session.hasError;
    var errorMsg = req.session.errorMessage;
    var regSuccess = req.session.registrationHasSucceded;

    req.session.destroy();

    res.render('index', { hasError: error, errorMessage: errorMsg, hasRegisterSuccess: regSuccess });
});

/* login attempt */
router.post('/', function(req, res) {
    var usersRef = db.collection('users');
    var loginQueryRef = usersRef.where('email', '==', req.body.email);

    loginQueryRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                req.session.hasError = true;
                req.session.errorMessage = `No user with email <${req.body.email}> exists!`;
                res.redirect('/');
            } else {
                console.log("email exists! checking password");
                const doc = snapshot.docs[0];
                console.log(doc);
                const passwordMatches = bcrypt.compareSync(req.body.password, doc.get('password'));
                if (passwordMatches) {
                    // TODO: add user data to session
                    res.redirect("/contacts");
                }
                else {
                    req.session.hasError = true;
                    req.session.errorMessage = `Incorrect Password`;
                    res.redirect('/');
                }
            }
        })
        .catch(err => {
            // TODO: handle error
        });

});

module.exports = router;
