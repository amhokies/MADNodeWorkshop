var mongoose = require('mongoose');
var models = require('./models');

var Post = models.Post;
var Comment = models.Comment;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var db = mongoose.connection;

db.once('open', function(callback) {
    console.log('We are now connected to our MongoDB database!');

    var newPost = new Post({ body: 'This is the post!' });

    var comment1 = new Comment({
        body: 'This is the first comment.',
        parent: newPost
    });

    var comment2 = new Comment({
        body: 'This is the second comment.',
        parent: newPost
    });

    comment1.save(function(err) {});
    comment2.save(function(err) {});

    newPost.comments.push(comment1);
    newPost.comments.push(comment2);

    newPost.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(newPost);
        }
    });
});
