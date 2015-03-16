var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:       String,
    age:            Number,
    lastUpdated:    Date,
    friends:        [String]
});
