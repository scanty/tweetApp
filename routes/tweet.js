
var express = require('express');
var router = express.Router();

router.get("/tweet", function(request, response){
    response.render("pages/tweet"); 
});

module.exports = router;