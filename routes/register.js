var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const fb = require('fb');
const db = fb.firestore();

/* GET register page. */
router.get('/', (req, res) => {
    console.log("in the router.get");
    res.render('register', { hasError: false });
});

/* time to make an account */
router.post('/', function(req, res) {
    const SALT_FACTOR = 10;

    let userExists = db.collection('users').where('email', '==', req.body.email).get()
        .then(snapshot => {
            // only add new user if it doesn't exist!
            if (snapshot.empty) {
                let addUser = db.collection('users').add({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, SALT_FACTOR)
                }).then(() => {
                    req.session.registrationHasSucceded = true;
                    res.redirect('/');
                }).catch((err) => {
                    console.log(err);
                    req.session.hasError = true;
                    req.session.errorMessage = "error creating account! please try again"
                });
            }
            else {
                res.render('register', { hasError: true, errorMessage: "email already in use!"});
            }
        })
        .catch(err => {
            console.log(err);
            req.session.hasError = true;
            req.session.errorMessage = "error creating account! please try again";
        });
});
module.exports = router;
