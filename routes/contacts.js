var express = require('express');
var router = express.Router();

/* GET contact manager page for logged in user. */
router.get('/', function(req, res, next) {
    // TODO: pass user data from session to render
    // pass whole mongo object?
    // also need to pass contacts
    res.render('contacts', {
        name: "Autumn"
    });
});

module.exports = router;
