require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const engine = require("ejs-mate")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const port = 4000;
const passport = require("passport");
const User = require('./models/user');
const session = require('express-session')
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');


// const seedPost = require('./seed');
// seedPost();

const reviewsRouter = require('./routes/reviews');
const app = express();
//connect to datatbase
mongoose.connect('mongodb+srv://bona9ja:11112222*++BoNa@cluster0.0gohh.mongodb.net/SurfShop?retryWrites=true&w=majority', err => {
  if (err) throw err;
  console.log('connected to MongoDB')
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.engine('ejs', engine)
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(methodOverride("_method"))

//Add moment to every view 
app.locals.moment = require("moment")

//configure express n sessions
app.use(session({
  secret: 'bonatheripper',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use( function(req, res, next) {
  // req.user =  {
  //   "_id" :  "623d1789f3a8369f06b69320",
  //  "username" : "bon"
  // }
  
res.locals.currentUser = req.user;
res.locals.title = " Surf Shop";
res.locals.success = req.session.success || " ";
delete req.session.success;

res.locals.error = req.session.error || " ";
delete req.session.error;
next()
})

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/post/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
 req.session.error = err.message;
 res.redirect("back")
});
app.listen(port, function () {
  console.log("serving on port " + port)
})
module.exports = app;