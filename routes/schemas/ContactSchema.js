let mongoose = require('mongoose');

let ContactsSchema = new mongoose.Schema({
    daddy: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    addressLineOne: String,
    addressLineTwo: String,
    city: String,
    state: String,
    zipcode: String
});

// allows for searching by first and last name
ContactsSchema.index({firstName: 'text', lastName: 'text'});

mongoose.model('Contact', ContactsSchema);
module.exports = mongoose.model('Contact');
