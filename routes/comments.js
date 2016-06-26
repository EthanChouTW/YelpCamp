var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware");

// **********************
// Comments ROUTES
// **********************

router.get("/new", middleware.isLoggedIn, function(req, res) {
    
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("commments/new", {campground: campground});
        }
    })
})


router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup camgpround using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
            
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "somehting went wrong")
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment)
                    req.flash("success", "successfully added comment")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    // create new comment
    //
})

// edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
             res.render("commments/edit", {campground_id: req.params.id, comment: foundComment})
        }
    });
    
})

// comment update
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    console.log(req.params);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    console.log("hehehehe");
    //findbyID and remove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err){
           res.redirect("back");
       } else{
           req.flash("success", "comment delete")
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
    
})


module.exports = router