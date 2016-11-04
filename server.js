var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
//var https = require('https');
//var unirest = require('unirest');
var Twitter = require('twitter');

var consumerKey = 'eAXJ7pl2UmIHrHMi5bJXjDuQb';
var secretKey = 'XBd2vdJsQhaBX9R5Zb5I5omnA90Zgj7aozWiclGAWz44CGGlEE';
var bearerToken = 'AAAAAAAAAAAAAAAAAAAAAKjgxgAAAAAA%2BGWPIRvkmcL30y5zTjjvj5yi0Co%3DSKm642QK5dP9DFeIbj9jm61YNbrlRbLUwmmriW4xuomHiShi3b';
var client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: secretKey,
    bearer_token: bearerToken
});

var port = 3000;
var server = http.createServer(app);

app.use("/public/js", express.static(__dirname + '/public/js'));
app.use("/public/css", express.static(__dirname + '/public/css'));

app.get('/', function(request, response){

    response.sendFile(path.join(__dirname) + '/public/Default.html');

}).listen(port, function(){
    console.log('Server listening on port ' + port);
});

app.get('/search', function(appReq, appRes) {
    //var weathers = ["Thunder", "Rain", "Lightning", "Storm", "Flood"];
    var count = 0;
    var results = [];
    var terms = appReq.query.terms;
    console.log(terms);
    var location = appReq.query.location;
    console.log(location);

    for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        var query = location + '%20' + term;
        console.log(query);
        var url = 'search/tweets.json?q=' + query + "&lang=en&result_type=recent&count=100";
        console.log(url);

    client.get(url, function (error, tweets, clientRes) {
        if (!error){
            //console.log(tweets);
            results.push(tweets);
        }
        else{
            console.error("Error: " + error);
        }
        count ++;

        if (count == terms.length){
            var finalResults = Process(results, terms);

            appRes.status(200).send(finalResults);
            appRes.end();
        }
        //console.log("CLIENT RESPONSE");
        //console.log(clientRes);
    });
    }
});

function Process(data, terms) {
    var results = new Result([]);
    for (var i = 0; i < data.length; i++) {
        var category = new Category(term, []);
        var tweets = data[i];
        console.log(tweets.statuses);
        console.log(tweets.statuses.length);
        console.log("---------------------------------------------------------------")
        var term = terms[i];
        var category = new Category(term, []);
        for (var j = 0; j < tweets.statuses.length; j++) {
            var tweet = tweets.statuses[j];
            console.log("TWEET")
            console.log(tweet);
            var text = tweet.text;
            var user = tweet.user;
            console.log(user);
            var t = new Tweet(user.screen_name, text, tweet.created_at);
            category.tweets.push(t);
        }
        results.categories.push(category);

    }
    return results;
}


function Result (categories){
    this.categories = categories;
}

function Category (category, tweets){
    this.category = category;
    this.tweets = tweets;
}

function Tweet(author, text, created){
    this.author = author;
    this.text = text;
    this.created = created;
}
