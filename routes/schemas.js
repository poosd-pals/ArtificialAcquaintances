// Schemas
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var ContactsSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String
});

var UserSchema = new mongoose.Schema({  
  name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  contacts: [ContactsSchema]
});

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
