var mongoose = require('mongoose');
var models = require('./models');

var Post = models.Post;
var Reply = models.Reply;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var db = mongoose.connection;

db.once('open', function(callback) {
    console.log('We are now connected to our MongoDB database!');

    var newPost = new Post({ body: 'This is the post!' });

    var reply1 = new Reply({
        body: 'This is the first reply.',
        parent: newPost._id
    });

    var reply2 = new Reply({
        body: 'This is the second reply.',
        parent: newPost._id
    });

    reply1.save(function(err) {});
    reply2.save(function(err) {});

    newPost.replies.push(reply1._id);
    newPost.replies.push(reply2._id);

    newPost.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success!');
        }
    });
});
