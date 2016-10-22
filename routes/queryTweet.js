var express = require('express');
var router = express.Router();

router.get('/queryTweet', function(request, response) {
    response.render('pages/queryTweet');
});

module.exports = router;