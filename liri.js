require('dotenv').config();
const fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function listen(command, argument) {
  switch (command) {
    case 'my-tweets':
      myTweets();
      break;
    case 'spotify-this-song':
      spotifySongInfo(argument);
      break;
    case 'movie-this':
      movieInfo(argument);
      break;
    case 'do-what-it-says':
      doText();
      break;
  }
}

function myTweets() {
  var params = {
    screen_name: '@Russian23718903',
    count: 5 //or 20
  };
  client.get('statuses/user_timeline', params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (element in tweets) {
        console.log(tweets[element].text);
      }
    }
  });
}

function spotifySongInfo(songName) {
  if (songName === '') {
    songName = 'Humble';
  }
  spotify.search({ type: 'track', query: songName, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songInfo = data.tracks.items[0].artists[0].name;
    console.log('Artist(s): ' + songInfo);

    var sName = data.tracks.items[0].name;
    console.log('Song Name: ' + sName);

    var previewURL = data.tracks.items[0].external_urls.spotify;
    console.log('Preview Link: ' + previewURL);

    var album = data.tracks.items[0].album.name;
    console.log('Album: ' + album);
  });
}

function movieInfo(movie) {
  if (movie === '') {
    movie = 'The Matrix';
  }
  var queryUrl =
    'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy';
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var title = JSON.parse(body).Title;
      console.log('Title: ' + title);

      var year = JSON.parse(body).Year;
      console.log('Year: ' + year);

      var rating = JSON.parse(body).imdbRating;
      console.log('IMDB Rating: ' + rating);

      //Can't get rotten tomatoes to work...fix
      var rottenTomatoes = JSON.parse(body).Ratings[0];
      console.log('Rotten Tomatoes Rating: ' + rottenTomatoes);

      var country = JSON.parse(body).Country;
      console.log('Country: ' + country);

      var language = JSON.parse(body).Language;
      console.log('Languages:' + language);

      var plot = JSON.parse(body).Plot;
      console.log('Plot: ' + plot);

      var actors = JSON.parse(body).Actors;
      console.log('Actors: ' + actors);
    }
  });
}

function doText() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(',');
    var command = dataArr[0];
    var argument = dataArr[1];
    listen(command, argument);
  });
}

listen(process.argv[2], process.argv[3]);
