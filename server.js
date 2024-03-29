var express = require('express'),
    stylus = require('stylus'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path){
    return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
//app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
//app.use(stylus.middleware(__dirname + '/public'));
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/bloodbowl');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error...'));
db.once('open', function callback(){
    console.log('Bloodbowl db opened');
});

var teamSchema = mongoose.Schema({ teamName: String });
var Team = mongoose.model('team', teamSchema);
var teamName;

Team.findOne().exec(function(err, doc){
    if(err) console.log(err);
    teamName = doc.teamName;
});

app.get('/partials/:partialPath', function(req, res){
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res){
    res.render('index', {teamName: teamName});
});

var port = 3030;
app.listen(port);
console.log('Server listening on port ' + port + '...');