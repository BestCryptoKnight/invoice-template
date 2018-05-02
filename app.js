var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var compression = require('compression')

var app = express();

/**
 * View engine setup
 */
app.set('views', [__dirname, 'client/dist', __dirname, 'client']);
//app.set('views', path.join(__dirname, 'client/dist'));
app.set('view engine', 'ejs');


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static( path.join(__dirname, 'client/static')));
//app.use('/graphql', graphqlHTTP({ schema: graphqlSchema, graphiql: true }));
// session
app.use(require('express-session')({secret: 'apideo', resave: true, saveUninitialized: true}));
// initialize


/**
 * Compression
 *
 */
function shouldCompress(req, res) {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
}
app.use(compression({
        level: 2,               // set compression level from 1 to 9 (6 by default)
        filter: shouldCompress, // set predicate to determine whether to compress
}));


/**
 * Route
 */

var invoices = require('./routes/api/invoices');
app.use('/api/invoice', invoices);



app.get('*',
    (req, res) => {
        res.render('index');
    }
);

/**
 * Setup mail config
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
