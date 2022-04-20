// require('dotenv').config()
const createError = require('http-errors');
const Section = require('./models/sections');
const {updateSection} = require('./controllers/updateSections');
const express = require('express');
const app = express();
const fs = require("fs");
const port = 3000;
const engine = require("ejs-mate")
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require("passport");
const session = require('express-session')
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const sectionRouter = require('./routes/section');
const indexRouter = require('./routes/index');




mongoose.connect('mongodb+srv://bona9ja:11112222*++BoNa@cluster0.0gohh.mongodb.net/Nairaland?retryWrites=true&w=majority', err => {
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

app.use(session({
    secret: 'bonatheripper',
    resave: false,
    saveUninitialized: true
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  
//   passport.use(User.createStrategy());
  
//   passport.serializeUser(User.serializeUser());
//   passport.deserializeUser(User.deserializeUser());

  app.use( function(req, res, next) {
  res.locals.success = req.session.success || " ";
  delete req.session.success;
  res.locals.error = req.session.error || " ";
  delete req.session.error;
  next()
  })

 
  
  app.use("/", indexRouter);
  app.use("/section", sectionRouter);

// updateSection()























app.listen(port, function () {
    console.log("serving on port " + port)
  })
  module.exports = app;