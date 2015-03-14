var express = require('express');

var app = express();

var router = express.Router();

router.get('/', function(request, response) {
    response.json({
        message: 'Welcome to our API.'
    });
});

app.use('/api', router);

app.listen(3000);

console.log('Server started on port 3000');
