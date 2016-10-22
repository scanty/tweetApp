var express = require('express');
var router = express.Router();
var pg = require('pg');

router.get('/debug', function(request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM tbl_HashTags', function(err, res1) {
            if (err) {
                done();
                console.error(err);
                response.send("Error " + err);
            }
            //console.log(res1.rows);
            client.query('SELECT * FROM tbl_Tweets', function(err, res2) {
                if (err) {
                    done();
                    console.error(err);
                    response.send("Error " + err);
                }
                client.query('SELECT * FROM tbl_HashTagsTweet', function(err, res3) {
                    if (err) {
                        done();
                        console.error(err);
                        response.send("Error " + err);
                    }
                    response.render('pages/debug', { tweets: res2.rows, tags: res1.rows, hashTweets: res3.rows });
                });
            });
        });
    });
});

module.exports = router;