var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// ==========
// authRoutes
// ==========

router.get("/", function(req, res){
    res.render("landing");
})


// show regitster form
router.get("/register", function(req, res){
    res.render("register");
})


// handle sign up logic
router.post("/register", function(req, res){
    console.log("someone sign up ");
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            req.flash("error", err.message);
             res.redirect("register")
            
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcom to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    } )
})

// show login form
router.get("/login", function(req, res){
    res.render("login")
})

//handling login logic
router.post("/login", passport.authenticate("local", 
    {   successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
    
})

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds")
})

// // middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     req.flash("error","Please Login First!")
//     res.redirect("/login")
// }

module.exports = router