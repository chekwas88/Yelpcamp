var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middlewareobj = {};

middlewareobj.checkCampgroundOwnership = function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                req.flash("error", "cannot find campground");
                res.redirect("/campgrounds");
            }else{
                // does the user own the campground
                 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Access Denied!!!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to log in");
        res.redirect("back");
    }
};

middlewareobj.checkCommentOwnership =  function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id, function(err, foundComment) {
            if(err){
                req.flash("error", "cannot find comment");
                res.redirect("/campgrounds");
            }else{
                // does the user own the comment
                 if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Access Denied");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

middlewareobj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login");
    res.redirect("/login");
};


module.exports = middlewareobj;

