var express = require('express');
var app = express();
var pg = require('pg');
var bp = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//setting the routes
app.get('/', require('./routes/index'));
app.get('/queryTweet', require('./routes/queryTweet'));
app.get('/tweetList', require('./routes/tweetList'));
app.get("/debug", require('./routes/debug'));
app.get("/tweet", require('./routes/tweet'));
app.post('/postTweet', require('./routes/postTweet'));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});