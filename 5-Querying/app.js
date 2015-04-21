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
///////////////////// POST ROUTES /////////////////////////
///////////////////////////////////////////////////////////

// Route handler for /api/posts/new
// Type: POST request
// Saves a new post to the database.
// Params:
//  author: The author of the post. Can be left blank if anonymous.
//  msg:    The message of the post.
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

// Route handler for /api/posts/latest
// Type: GET request
// Retrieves the 5 latest posts.
postRouter.route('/latest').get(function(request, response) {
    Post.find({})
        .populate('replies')
        .sort('-time')
        .limit(5)
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

// Route handler for /api/posts/upvote
// Type: POST request
// Upvotes a post.
// Params:
//  postID: The ID of the post to upvote.
postRouter.route('/upvote').post(function(request, response) {
    var id = request.body.postID;

    Post.findById(id, function(err, doc) {
        if (doc) {
            doc.points++;
            doc.save();

            response.json(doc);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });
});

// Route handler for /api/posts/downvote
// Type: POST request
// Downvotes a post. The post will be deleted once it gets -5 points.
// Params:
//  postID: The ID of the post to downvote.
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

// Route handler for /api/posts/delete
// Type: DELETE request
// Removes the post from the database as well as all of the comments on the post.
// Params:
//  postID: The ID of the post to delete.
postRouter.route('/delete').delete(function(request, response) {
    var id = request.body.postID;

    Post.findById(id, function(err, doc) {
        if (doc) {
            doc.remove();
            response.json(doc);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });
});

///////////////////////////////////////////////////////////
////////////////// COMMENT ROUTES /////////////////////////
///////////////////////////////////////////////////////////


commentRouter.route('/new').post(function(request, response) {
    var msg = request.body.message;
    var id = request.body.postID;

    var newComment = new Comment({ body: msg });

    // First we have to find if the post exists
    Post.findById(id, function(err, post) {
        if (post) {
            // Now we know the post exists, we can add the comment and save
            response.json(doc);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });


    newComment.save(function(err) {
        if (err) {
            response.status(400);
            response.json({ msg: 'Error' });
        } else {
            response.status(200);
            response.json(newComment);
        }
    });
});

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.listen(port);

console.log('Server started on port ' + port);
