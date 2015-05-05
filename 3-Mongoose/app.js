var mongoose = require('mongoose');
var models = require('./models');

var Post = models.Post;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var db = mongoose.connection;

db.once('open', function(callback) {
    console.log('We are now connected to our MongoDB database!');

    var newPost = new Post({ body: 'This is the post!' });

    newPost.comments.push({ body: 'Hello!' });
    newPost.comments.push({ body: 'Bye!' });

    newPost.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(newPost);
        }
    });
});
