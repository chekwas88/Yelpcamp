var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")


 router.get("/", function(req, res){
   res.render("landing"); 
});
// ==============
// AUTH ROUTE
//===============


// Show register form
 router.get("/register", function(req, res) {
    res.render("authentication/register", {page: "authentication/register"});
});

// Retrieve data from resgister form and authenticate
 router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
               req.flash("success", "You have successfully registered as " + user.username);
               res.redirect("/campgrounds"); 
            });
        }
    });
});


// Show login form
 router.get("/login", function(req, res) {
    res.render("authentication/login", {page: "authentication/login"});
});

// handle login data
 router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {
   
});

// Logout Route
 router.get("/logout",  function(req, res) {
    req.logout();
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
});




module.exports = router;
