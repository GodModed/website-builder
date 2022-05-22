//create a default express app with cookie parser and body parser
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')

//setup the app to use cookie parser and body parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

//create views
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//setup router
var routerFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));
for(const file of routerFiles) {
    const router = require('./routes/' + file);
    let fileName = file.substring(0, file.length - 3);
    if (fileName == 'home') fileName = '';
    app.use('/' + fileName, router);
}

//start the server
const server = app.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}`);
});