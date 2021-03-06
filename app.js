var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
const nconf = require('nconf');
nconf.argv().env().file({ file: './secrets.json' });

//Auth modules
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Models
const User = require('./models/User');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//mongoose setup
const mongoose = require('mongoose');
const mongoDB =
    nconf.get('MONGODB_URI') || process.env.MONGODB_URI || env.DB_URL;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

var app = express();
var hbs = exphbs.create({
    /* config */
});
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
passport.use(
    new LocalStrategy((username, password, done) => {
        try {
            User.findOne({ username: username }).exec((err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log('INCORECT USER');
                    return done(null, false, { msg: 'Incorrect username' });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    console.log('INCORECT Pass');
                    return done(null, false, { msg: 'Incorrect password' });
                }

                return done(null, user);
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
);
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.currentUser = req.user.toObject();
    }

    next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
