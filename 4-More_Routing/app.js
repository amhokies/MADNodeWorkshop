var express = require('express');

var app = express();

var router = express.Router();

// Router for url ending in /users
router.route('/users')

    // Get Request
    .get( function(request, response) {
        response.send('List all users.');
    })

    // Post Request
    .post( function(request, response) {
        response.send('Create a new user.');
    });

// Router for url specifying a username
router.route('/users/:username')

    .get( function(request, response) {
        response.send('Get user: ' + request.params.username);
    })

    .put( function(request, response) {
        response.send('Update user: ' + request.params.username);
    })

    .delete( function(request, response) {
        response.send('Delete user: ' + request.params.username);
    });



app.use('/api', router);
app.listen(3000);
