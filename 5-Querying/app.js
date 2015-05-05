var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var models = require('./models');
var Post = models.Post;

mongoose.connect("mongodb://root:mad@ds031117.mongolab.com:31117/mad");

var app = express();
var postRouter = express.Router();
var commentRouter = express.Router();

var port = 3000;

// Adding a parser for data encoded in post requests
app.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////////////////////////////
///////////////////// POST ROUTES /////////////////////////
///////////////////////////////////////////////////////////

// Route handler for /api/posts/new
// Type: POST request
// Saves a new post to the database.
// Params:
//  author: The author of the post. Can be left blank if anonymous.
//  message:    The message of the post.
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
            response.json({ msg: 'Error' });
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
        .sort('-time')
        .limit(5)
        .exec(function(err, posts) {
            if (err) {
                response.status(400);
                response.json({ msg: 'Error' });
            } else {
                response.json(posts);
            }
        });
});

// Route handler for /api/posts/:id -- where :id is the id of the post to get
// Type: GET request
// Retrieves a post by its id number.
postRouter.route('/:id').get(function(request, response) {
    var id = request.params.id;

    Post.findById(id, function (err, post) {
        if (post) {
            response.json(post);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found' });
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

    Post.findById(id, function(err, post) {
        if (post) {
            post.points++;
            post.save();

            response.json(post);
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

    Post.findById(id, function(err, post) {
        if (post) {

            post.points--;

            post.save();
            response.json(post);
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

    Post.findById(id, function(err, post) {
        if (post) {
            post.remove();
            response.json(post);
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });
});

///////////////////////////////////////////////////////////
////////////////// COMMENT ROUTES /////////////////////////
///////////////////////////////////////////////////////////

// Route handler for /api/comments/new
// Type: POST request
// Saves a new comment to a post.
// Params:
//  message: The message of the post.
//  postID: The id of the post to add the comment to.
commentRouter.route('/new').post(function(request, response) {
    var msg = request.body.message;
    var id = request.body.postID;

    // First we have to find if the post exists
    Post.findById(id, function(err, post) {
        if (post) {
            post.comments.push({ body: msg });

            // Saving the post with the new comment added.
            post.save(function(err) {
                if (err) {
                    response.status(400);
                    response.json({ msg: 'Error' });
                } else {
                    response.json(post);
                }
            });
        } else {
            response.status(404);
            response.json({ msg: 'Post not found'});
        }
    });
});

// Route handler for /api/comments/upvote
// Type: POST request
// Upvotes a single comment.
// Params:
//  postID: The id of the post the comment is on
//  commentID:  The id of the comment to downvote
commentRouter.route('/upvote').post(function(request, response) {
    var pID = request.body.postID;
    var cID = request.body.commentID;

    Post.findById(pID, function(err, post) {
        if (post) {
            var comment = post.comments.id(cID);

            if (comment) {
                comment.points++;
                post.save( function(err) {
                    response.json(post);
                });
            } else {
                response.status(404);
                response.json({ msg: 'Comment not found' });
            }
        } else {
            response.status(404);
            response.json({ msg: 'Post not found' });
        }
    });
});

// Route handler for /api/comments/downvote
// Type: POST request
// Downvotes a single comment.
// Params:
//  postID: The id of the post the comment is on
//  commentID:  The id of the comment to downvote
commentRouter.route('/downvote').post(function(request, response) {
    var pID = request.body.postID;
    var cID = request.body.commentID;

    Post.findById(pID, function(err, post) {
        if (post) {
            var comment = post.comments.id(cID);

            if (comment) {
                comment.points--;
            } else {
                response.status(404);
                response.json({ msg: 'Comment not found' });
            }
        } else {
            response.status(404);
            response.json({ msg: 'Post not found' });
        }
    });
});

commentRouter.route('/delete').delete(function(request, response) {
    var pID = request.body.postID;
    var cID = request.body.commentID;

    Post.findById(pID, function(err, post) {
        if (post) {
            var comment = post.comments.id(cID);

            if (comment) {
                comment.remove();

                post.save( function(err) {
                    if (err) {
                        response.json({ msg: 'Error '});
                    } else {
                        response.json(post);
                    }
                });

            } else {
                response.status(404);
                response.json({ msg: 'Comment not found' });
            }
        } else {
            response.status(404);
            response.json({ msg: 'Post not found' });
        }
    });
});

app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.listen(port);

console.log('Server started on port ' + port);
