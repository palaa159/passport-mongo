// app/models/user.js
// load the things we need
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    login: {
        local: {
            email: String,
            password: String,
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String
        },
        twitter: {
            id: String,
            token: String,
            tokenSecret: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String
        }
    },
    userPublic: {
        restriction: {
            type: Number,
            default: 1
        },
        bot: {
            id: {
                type: String
            },
            status: {
                title: {
                    type: Boolean,
                    default: false
                },
                date: Date
            },
            stream: [{
                tweet_date: Date,
                tweet_id: String,
                tweet_text: String,
                tweet_user: {}
            }],
            // favorited_tweets
            // also includes unfavorited ones
            favorited_tweets: [{
                tweet_id: String,
                date: Date
            }],
            favorite_limit: Number,
            unfavorite_limit: Number,
            // level of hostility
            aggressiveness: {
                type: Number,
                default: 1
            }
        },
        fav_criteria: {
            keywords: {
                type: Array,
                default: ['hello']
            },
            unwanted_keywords: {
                type: Array,
                default: ['followme', 'followback', 'followmeback', 'follow me']
            },
            lang: {
                type: String,
                default: 'en'
            }
        }
    },
    userPrivate: {
        lastActive: {
            ip: {
                type: String,
                default: ''
            },
            date: {
                type: Date
            }
        },
        ipList: Array
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);