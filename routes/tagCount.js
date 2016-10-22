var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/tagCount', function(request, response) {
    var tagText = request.query.tag;
    //console.log(request);
    if (tagText === undefined || tagText.length == 0) {
        response.status(200).send({ tag: "", count: 0 });
        return;
    }
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("select count(HTT.tweetid) FROM tbl_HashTagsTweet HTT WHERE HTT.tagid IN ( SELECT tagid FROM tbl_HashTags WHERE hashtag = '" + tagText + "')", function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.send(200, { error: err });
            }
            else {
                response.send(200, { tag: tagText, count: result.rows[0].count });
            }
        });
    });
});

module.exports = router;