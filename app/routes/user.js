var debug = require('debug')('app:user')
var express = require('express')
var router = express.Router()
var User = require('../models/user')

var Bot = require('../bot/bot')()
    /* GET users listing. */

// Collect IP Address
router.use(function(req, res, next) {
    User.findByIdAndUpdate(req.session.passport.user, {
            'userPrivate.lastActive': {
                ip: req.ip,
                date: new Date()
            }
        }, {
            new: true
        },
        function(err, user) {
            if (err) {
                debug(err)
            } else {
                // debug('User IP Updated')
            }
            // Check permission
            if (user) {
                if (user.userPublic.restriction > 0) {
                    next();
                } else {
                    res.end('You do not have permission, or have been banned');
                }
            }
        });

    // Check permission, aka user restriction
    // if 0, means banned
});

router.get('/', function(req, res, next) {
    // res.send('respond with a resource')
    res.render('user', {
        user: req.user
    })
})

/**
 *	GET /user/tweets
 *	See list of tweets
 **/
router.get('/tweets', function(req, res, next) {
    res.render('user-tweets', {
        user: req.user
    })
})

/**
 *	POST /user/update
 **/
router.post('/update', function(req, res) {
    debug(req.body) // -> Array of String
    // Update User
    User.findByIdAndUpdate(req.session.passport.user, {
            'userPublic.fav_criteria.keywords': req.body.keyword,
            'userPublic.fav_criteria.unwanted_keywords': req.body.unwantedKeyword
        }, {
            new: true
        },
        function(err, user) {
            if (err) {
                debug(err);
                res.json({
                    success: false
                })
            } else {
                debug('%s\'s favorite criteria is updated', req.session.passport.user)
                // restart bot
                debug(user.userPublic.fav_criteria.unwanted_keywords)
                Bot.kill(user, function() {
                    debug('Bot stopped')
                    Bot.create(user, function() {
                        debug('Bot started')
                    })
                })
                res.json({
                    success: true
                })
            }
        });
})

/**
 *	POST /user/bot
 **/
router.post('/bot', isBodyBoolean, function(req, res) {
    // console.log(req.body.status)
    User.findByIdAndUpdate(req.session.passport.user, {
        'userPublic.bot.status.title': req.body.status,
        'userPublic.bot.status.date': new Date().getTime()
    }, {
        new: true
    }, function(err, user) {
        if (err) {
            res.json({
                success: false,
                data: 'Err'
            })
        }
        if (user) {
            if (req.body.status === "true") {
                Bot.kill(user, function() {
                    debug('Bot stopped')
                    Bot.create(user, function() {
                        debug('Bot started')
                    })
                })
            } else if (req.body.status === "false") {
                Bot.kill(user, function() {
                    debug('Bot Stopped')
                })
            }

            res.json({
                success: true,
                data: req.body.status
            })
        }
    })
})

module.exports = router

/**
 * Helper
 **/
function isBodyBoolean(req, res, next) {
    if (typeof(JSON.parse(req.body.status)) === 'boolean') {
        next()
    } else {
        res.end('u no legit user, must be banned')
    }
}