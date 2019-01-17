const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bcrypt = require('bcrypt');
const session = require('express-session');

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const contactManagerRouter = require('./routes/contacts');

const app = express();
const port = 9001;

// ------ bodyparser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
// ------ /bodyparser


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret!",
    key: "",
    hasError: false,
    errorMessage: "",
    hasRegisterSuccess: false,
    }));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/contacts', contactManagerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

app.listen(port);
console.log("now listening on port ", port);
