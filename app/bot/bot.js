// ./bot/bot.js
// Here we build the robot
var debug = require('debug')('app:bot')
var Twit = require('twit')
var auth = require('../config/auth')
var User = require('../models/user')

module.exports = function() {
    var service = {};

    service.create = function(user, cb) {
        if (bots) {
            bots[user.id] = {
                twit: new Twit({
                    consumer_key: auth.twitterAuth.consumerKey,
                    consumer_secret: auth.twitterAuth.consumerSecret,
                    access_token: user.login.twitter.token,
                    access_token_secret: user.login.twitter.tokenSecret
                })
            }
            var thisBot = bots[user.id]
            thisBot.stream = thisBot.twit.stream('statuses/filter', {
                track: user.userPublic.fav_criteria.keywords
            })
            thisBot.stream.on('tweet', function(t) {
                // Check exists and collect t.id_str
                // Filtering unwanted keywords:
                // followme, followback, `follow back`
                if (shouldCollectFilter(t.text, user)) {
                    User.findByIdAndUpdate(user.id, {
                        $addToSet: {
                            'userPublic.bot.stream': {
                                tweet_date: t.created_at,
                                tweet_id: t.id_str,
                                tweet_text: t.text,
                                tweet_user: t.user
                            }
                        }
                    },
                    function(err, user) {
                        debug(user.login.twitter.username + ' has collected ' + (user.userPublic.bot.stream.length + 1) + ' tweets with keywords: ' + user.userPublic.fav_criteria.keywords.filter(function(e) {
                            return e
                        }))
                    })
                }
            })

            // TODO: Catch stream Error
        }
        if (cb) cb();
    };

    service.kill = function(user, cb) {
        if (bots && bots[user.id]) {
            // debug(bots)
            // debug(user.id)
            // Stop stream
            // stream.stop()
            bots[user.id].stream.stop()
        }
        if (cb) cb();
    }

    return service;
};

// Helpers
function shouldCollectFilter(text, user) {
	var hasWord = false;
	for(var i = 0; i < user.userPublic.fav_criteria.unwanted_keywords.length; i++) {
		if(text.toLowerCase().indexOf(user.userPublic.fav_criteria.unwanted_keywords[i].toLowerCase()) > -1) {
			debug('Tweet has unwanted word: ' + user.userPublic.fav_criteria.unwanted_keywords[i]);
			hasWord = true;
			break;
		}
	}
	return !hasWord;
}