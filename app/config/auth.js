// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '5Pu17oZ1CqwoHJCoOZBqCsinR', // your App ID
        'clientSecret': 'your-client-secret-here', // your App Secret
        'callbackURL': 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'gagZjEZdXYV6zhSQSlPz4A',
        'consumerSecret': 'HLRm7d1FsT55x94Oy9sQE00EXMFvRDcyOfh1i98sA',
        'callbackURL': 'http://127.0.0.1:3000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }

};