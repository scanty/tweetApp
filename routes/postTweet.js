var express = require('express');
var router = express.Router();
var pg = require('pg');

function addTagTweetRelation(client, tagDetails, tweetid) {
    var allTagArray = [];
    tagDetails.forEach(function(row) {
        allTagArray.push(row.tagid);
    });
    client.query("INSERT INTO tbl_HashTagsTweet(tagid, tweetid) SELECT ytag," + tweetid + " FROM unnest(ARRAY[" + allTagArray.join(',') + "]) ytag", function(err, res4) {
        if (err) {
            done();
            console.log(err);
        } else {
            console.log("added the relation!!!!!");
        }
    });
}

function addTweetAndTags(tweetText, tagSet) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("INSERT INTO tbl_Tweets(tweetTimestamp, tweetText) VALUES(now(),'" + tweetText + "') RETURNING tweetId", function(err, res1) {
            if (err) {
                done();
                console.error(err);
                //response.send("Error " + err);
            } else {
                var tweetid = res1.rows[0].tweetid;
                console.log("New tweetid: " +tweetid);
                if(tagSet.size == 0 ) {
                    console.log("No tags found in tweetId: " + tweetid);
                    done();
                    return;
                }
                
                var tagDetails = [];
                var tagArray = [];

                tagSet.forEach(function(tag) {
                    tagArray.push("'" + tag + "'");
                });
                //console.log("going to query: " + tagArray.join(','));
                client.query("SELECT * FROM tbl_HashTags WHERE hashTag IN (" + tagArray.join(',') + ")", function(err, res2) {
                    if (err) {
                        done();
                        console.log(err);
                    } else {
                        tagDetails = res2.rows;
                        res2.rows.forEach(function(tagRow) {
                            tagSet.delete(tagRow.hashtag);
                        });

                        tagArray = [];
                        tagSet.forEach(function(tag) {
                            tagArray.push("'" + tag + "'");
                        });

                        if (tagArray.length > 0) {
                            console.log("Going to add new tag: " + tagArray.join(','));

                            client.query("INSERT INTO tbl_HashTags(hashTag) SELECT xtag FROM unnest(ARRAY[" + tagArray.join(',') + "]) xtag RETURNING *", function(err, res3) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    tagDetails = res2.rows.concat(res3.rows);
                                    addTagTweetRelation(client, tagDetails, tweetid);
                                }
                                done();
                            });

                        } else {
                            addTagTweetRelation(client, res2.rows, tweetid);
                        }
                        done();
                    }
                });
            }
        });
    });
}

router.post('/postTweet', function(request, response, next) {
    var tweetText = request.body.tweetText;
    // console.log(tweetText);
    var status = "ok";
    var msg = "Tweet posted successfully!!!";
    if (tweetText === undefined || tweetText.length == 0) {
        status = "error";
        msg = "Empty tweet not allowed."
    } else {
        var words = tweetText.split(" ");
        var tagSet = new Set();
        //console.log(words);
        words.forEach(function(word) {
            if (word[0] == '#' && word.length > 1) {
                console.log("Found a tag >>>> " + word);
                tagSet.add(word.substring(1));
            }
        });
        addTweetAndTags(tweetText, tagSet);
    }
    response.send(200, {status : status, msg:msg});
});

module.exports = router;