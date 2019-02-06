// Schemas
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var ContactsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    address: {
        lineOne: String,
        lineTwo: String,
        city: String,
        state: String,
        zipcode: String
    }
});

// allows for searching by first and last name
ContactsSchema.index({firstName: 'text', lastName: 'text'});

var UserSchema = new mongoose.Schema({  
  name: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  contacts: [ContactsSchema]
});

// Hashes password when saving password
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt and hash with it
    bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
