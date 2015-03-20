var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Router for url ending in /users
router.route('/users')

    // Get Request
    .get( function(request, response) {
        response.send('List all users.');
    })

    // Post Request
    .post( function(request, response) {
        var name = request.body.username;
        var age = request.body.age;
        response.send('Create user with name ' + name + ' and age ' + age);
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
app.listen(port);

console.log('Server started on port ' + port);
