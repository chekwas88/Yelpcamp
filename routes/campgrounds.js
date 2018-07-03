var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);
 



//INDEX ROUTE
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/index", {campgrounds:campgrounds, currentUser: req.user, page: "/campgrounds"});
       }
    });
    
    
    
});

//NEW
router.get("/campgrounds/newcamp", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/newcamp");
});

// CREATE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    //get the parameter from the form
    var name = req.body.campName;
    var price = req.body.campprice;
    var image = req.body.campImage;
    var desc = req.body.campDesc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    
    geocoder.geocode(req.body.location, function(err, data){
       if(err || !data.length) {
           req.flash("error", "Invalid Address");
           return res.redirect("back");
       }
       
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        
         var newCampData = {name:name, price:price, image:image, description:desc, author:author, location:location, lat:lat, lng:lng};
         
         Campground.create(newCampData,function(err, newCamp){
        if(err){
            console.log(err);
        } else {
            
            res.redirect("/campgrounds");
        }
        
        });
    
   
    });
    
   
    
    
    
    
});



//SHOW ROUTE
router.get("/campgrounds/:id", function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        
          if (!foundCampground) {
                return res.status(400).send("Item not found.");
            }
             res.render("campgrounds/show", {campground:foundCampground});
        
    });
   
});

//EDIT ROUTE

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
         if (!foundCampground) {
                return res.status(400).send("Item not found.");
            }
        
        res.render("campgrounds/edit", {campground:foundCampground});
        
    });
    
});


//UPDATE ROUTE
router.put("/campgrounds/:id",  middleware.checkCampgroundOwnership,function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
           if(err){
               res.redirect("/campgrounds");
           }else{
                if (!updatedCampground) {
                    return res.status(400).send("Item not found.");
                }
               res.redirect("/campgrounds/" + req.params.id);
           }
        });
    });    
});


// Delete ROUTE
router.delete("/campgrounds/:id",  middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err, removedCamp){
       if(err){
           res.redirect("/campgrounds/" + req.params.id );
       }else{
            if (!removedCamp) {
                return res.status(400).send("Item not found.");
            }
           res.redirect("/campgrounds");
       }
   }); 
});









module.exports = router;
