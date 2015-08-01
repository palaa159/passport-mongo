var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET auth listing. */
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/user',
        failureRedirect: '/'
    }));
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;