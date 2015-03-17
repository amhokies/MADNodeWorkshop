var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:       { type: String, required: true, unique: true },
    age:            { type: Number, min: 18, required: true },
    lastLogin:      { type: Date, default: Date.now },
    friends:        [String]
});

exports.User = mongoose.model('User', UserSchema);
