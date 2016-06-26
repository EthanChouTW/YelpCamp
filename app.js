var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    methodOverride = require("method-override"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seed")
    
// requiring routes    
var commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        authRoutes = require("./routes/index")
        
// 建立一個db叫yelp_camp
// local端的db當作測試區
// console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb://EthanChou:chouethan@ds023674.mlab.com:23674/yelpcampethanchou");

// seed the db
// seedDB();


        
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//passport config.
app.use(require("express-session")({
    secret: "enenenene express-session",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/",authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started")
})