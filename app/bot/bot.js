// ./bot/bot.js
// Here we build the robot
// Based on https://github.com/ttezel/twit/blob/master/examples/bot.js

var debug = require('debug')('app:bot')
var Twit = require('twit')
var auth = require('../config/auth')
var User = require('../models/user')

var Bot = module.exports = function(userId, token, secret) {
    this.userId = userId; // ID in mongo
    this.twit = new Twit({
        consumer_key: auth.twitterAuth.consumerKey,
        consumer_secret: auth.twitterAuth.consumerSecret,
        access_token: token,
        access_token_secret: secret
    })
}

Bot.prototype.tweet = function(status, cb) {
    if (typeof status !== 'string') {
        return cb(new Error('tweet must be of type String'));
    } else if (status.length > 140) {
        return cb(new Error('tweet is too long: ' + status.length));
    }
    this.twit.post('statuses/update', {
        status: status
    }, cb);
};

Bot.prototype.searchStatus = function(params, cb) {
    if (params) { // TODO: Validate parameters
        this.twit.get('search/tweets', params, function(err, reply) {
            // Compute all incoming tweets
            // Pull favorited_tweets
        })
    }
}

Bot.prototype.getUserFollowers = function() {

};

Bot.prototype.favoriteStatus = function() {

};

Bot.prototype.unfavoriteStatus = function() {

};

// Helpers
function handleError(err) {
    debug('response status:', err.statusCode);
    debug('data:', err.data);
}

/*
module.exports = function() {
    var service = {};

    // search for keywords
    service.searchKeyword

    return service;
};

// Helpers
function shouldCollectFilter(t, user) {
    var hasWord = false;
    var tUser = t.user;
    // Rules
    var multiplier = 100;

    if (t.filter_level !== 'none' &&
        !t.possibly_sensitive &&
        !t.favorited && // Have not favorited
        (tUser.description && tUser.description.length > 5) &&
        tUser.friends_count > 100 * multiplier &&
        tUser.favourites_count > 10 * multiplier &&
        tUser.statuses_count > 100 * multiplier
    ) {
        for (var i = 0; i < user.userPublic.fav_criteria.unwanted_keywords.length; i++) {
        	// TODO: Improve this using regex!
            if (t.text.toLowerCase().indexOf(user.userPublic.fav_criteria.unwanted_keywords[i].toLowerCase()) > -1) {
                debug('Tweet has unwanted word: ' + user.userPublic.fav_criteria.unwanted_keywords[i]);
                hasWord = true;
                break;
            }
        }
    } else {
        hasWord = true;
    }
    return !hasWord;
}*/