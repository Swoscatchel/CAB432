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

app.get('/search', function(appReq, appRes){
    var weathers = ["Thunder"];//, "Rain", "Lightning", "Storm", "Flood"];
    var count = 0;
    var results = new Result([]);

    for (var i = 0; i < weathers.length; i++){
        var weather = weathers[i];
        var category = new Category(weather, []);
        var query = weather + '%20australia';
        var url = 'search/tweets.json?q=' + query + "&lang=en&result_type=recent&count=100";
        console.log(url);

        client.get(url, function(error, tweets, clientRes) {
            count += 1;
            if (!error) {

                for (var j = 0; j < tweets.statuses.length; j++) {
                    var tweet = tweets.statuses[j];
                    var text = tweet.text;
                    var user = tweet.user;
                    console.log(user);
                    if (text.indexOf(weather) > 0) {
                        var t = new Tweet(user.screen_name, text, tweet.created_at);
                        category.tweets.push(t);
                    }
                }
                results.categories.push(category);
            }else {
                console.log("Error: ");
                console.log(error);
            }

            if (count == weathers.length){
                //var json = JSON.stringify(results);
                //console.log(json);
                console.log("SENDING");
                appRes.status(200).send(results);
                console.log("appRes sent");
                appRes.end();
            }
        });
    }
});

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
