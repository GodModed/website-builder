var express = require('express');
var router = express.Router();
var config = require('../config.json');

router.get('/', function(req, res, next){
    res.render('home.pug', {
        title: config.title + ' - Home'
    });
})

module.exports = router;