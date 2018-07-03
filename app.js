
//Require dependencies
require('dotenv').config();

var express      = require("express"),
 app             = express(),
 bodyParser      = require("body-parser"),
 mongoose        = require("mongoose"),
 //Campground    = require("./models/campgrounds"),
//var seedDB = require("./seed");
 //Comment       = require("./models/comments"),
 methothOverride = require("method-override"),
 passport        = require("passport"),
 LocalStrategy   = require("passport-local"),
 User            = require("./models/user"),
 expressSession  = require("express-session"),
 flash           = require("connect-flash");
 
 //Require ROUTES
 var campgroundRoute = require("./routes/campgrounds"),
     commentRoute    = require("./routes/comments"),
     indexRoute      = require("./routes/index");
     



mongoose.connect("mongodb://localhost/yelp_camp_v10");
app.set("view engine", "ejs");
app.use(methothOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.locals.moment = require('moment');


//passport configuration
app.use(expressSession({
    secret: "dashboard confessional",
    save: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});



app.use(campgroundRoute);
app.use(commentRoute);
app.use(indexRoute);


//seedDB();



//creating route for the yelcamp







app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp server started...");
});