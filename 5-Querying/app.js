var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var models = require('./models');
var Post = models.Post;
var Reply = models.Reply;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var app = express();
var postRouter = express.Router();
var commentRouter = express.Router();

var port = 3000;

// Adding a parser for data encoded in post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

///////////////////////////////////////////////////////////
///////// ROUTER FOR URLS SPECIFYING A POST ID ////////////
///////////////////////////////////////////////////////////

postRouter.route('/new').post(function(request, response) {
    var auth = request.body.author;
    var msg = request.body.message;

    var newPost = new Post({
        author: auth,
        body: msg
    });

    newPost.save(function(err) {
        if (err) {
            response.status(400);
            response.json({
                msg: 'Error'
            });
        } else {
            response.status(200);
            response.json(newPost);
        }
    });
});

// Router for /api/posts/latest
// Returns the last 200 posts
postRouter.route('/latest').get(function(request, response) {
    Post.find({})
        .populate('replies')
        .sort('-time')
        .limit(200)
        .exec(function(err, docs) {
            if (err) {
                response.status(400);
                response.json({
                    msg: 'Error'
                });
            } else {
                response.status(200);
                response.json(docs);
            }
        });
});

// Router to /api/posts/upvote
// Request body params:
//      postID - The ID of the post to upvote
//
postRouter.route('/upvote').post(function(request, response) {
    var id = request.body.postID;

    Post.findByIdAndUpdate(id, {
        $inc: {
            points: 1
        }
    }, function(err, doc) {
        response.json(doc);
    });
});

postRouter.route('/downvote').post(function(request, response) {
    var id = request.body.postID;

    Post.findById(id, function(err, doc) {
        if (doc) {

            doc.points--;

            if (doc.points <= -5) {
                doc.remove();
            } else {
                doc.save();
            }
            response.json(doc);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });
});

postRouter.route('/delete').delete(function(request, response) {

});

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.listen(port);

console.log('Server started on port ' + port);
