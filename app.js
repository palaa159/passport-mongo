// DEBUG=app:core, app:error nodemon bin/www
// Debugging
var ok = require('debug')('app:core')
var bad = require('debug')('app:error')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var routes = require('./app/routes/index')
var user = require('./app/routes/user')
var auth = require('./app/routes/auth')
var passport = require('passport')
var flash = require('express-flash')

var app = express()

// Global TwitterBot
global.bots = {}

// Mongo config
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')
var configDB = require('./app/config/database')
var User = require('./app/models/user')

ok('Connecting to MongoDB')
mongoose.connect(configDB.url, function(err) {
    if (err) {
        bad(err)
    } else {
        ok('Connected to MongoDB')
        init()
    }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Configuring Passport
require('./app/config/passport')(passport) // pass passport for configuration
app.use(session({
    secret: 'mySecretKey',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: true,
    secure: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
        // maxAge: 10 * 1000 // 10 seconds
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)
app.use('/auth', auth)
app.use('/user', user)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404;
    next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

// Initializer
// When the server restarted, stop all the bots
function init() {

}

module.exports = app;