var mongoose = require('mongoose');
var models = require('./models');

var User = models.User;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var db = mongoose.connection;

db.once('open', function(callback) {
    console.log('We are now connected to our MongoDB database!');

    var newUser = new User({ username: 'John', age: 18 });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
        }
    });
});
