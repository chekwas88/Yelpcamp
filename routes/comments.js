
var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");



//Creating sub route of comments

//NEW ROUTE of Comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground:campground}); 
       }
    });
   
});


//CREATE ROUTE of comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground) {
      if(err){
          console.log(err);
      } else {
           if (!foundCampground) {
                return res.status(400).send("Item not found.");
            }
          Comment.create(req.body.comments, function(err, comment){
              if(err){
                  req.flash("error", "something went wrong");
                  console.log(err);
              }else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  //redirect to the particular campground found
                  req.flash("success", "comment successfully created");
                  res.redirect("/campgrounds/" + foundCampground._id);
              }
          });
      }
   }); 
});

// EDIT COMMENT ROUTE
router.get("/campgrounds/:id/comments/:comments_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comments_id, function(err, foundComment) {
        if(err){
            res.render("back");
        }else{
            
             if (!foundComment) {
                return res.status(400).send("Item not found.")
            }
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
        }
    }); 
});
// UPDATE COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comments_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comments_id, req.body.comments, function(err, updatedComment){
       if (err) {
           res.redirect("back");
       }else{
           
           req.flash("success", "Comment updated successfully");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comments_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comments_id, req.body.comments, function(err, removedComment){
       if(err){
           
           res.redirect("back");
       }else{
            if (!removedComment) {
                return res.status(400).send("Item not found.")
            }
           req.flash("success", "Comment deleted successfully");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});







module.exports = router;

