var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/tweetList', function(request, response) {
    var tagText = request.query.tag;
    var tweetId = request.query.tweetid;

    if (tagText === undefined || tagText.length == 0) {
        response.status(200).send({ tag: "", count: 0 });
        return;
    }
    if (tweetId === undefined) {
        tweetId = 0;
    }
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("SELECT * FROM tbl_Tweets TT " +
            "INNER JOIN tbl_HashTagsTweet HTT " +
            "ON TT.tweetid = HTT.tweetid " +
            "INNER JOIN tbl_HashTags HT " +
            "ON HTT.tagid = HT.tagid " +
            "WHERE HT.hashtag = '" + tagText + "' " +
            "AND TT.tweetid > " + tweetId, function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    response.send(200, { error: err });
                }
                else {
                    response.status(200,{ tag: tagText, tweets: result.rows, count: result.rows.length });
                }
            });
    });
});

module.exports = router;