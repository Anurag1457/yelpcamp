var express = require("express"),
    app= express(),
    bodyparser=require("body-parser"),
	mongoose=require("mongoose"),
	flash   =require("connect-flash");
	passport= require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Campground=require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user");
	seedDB    =require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_y8",{ useNewUrlParser: true ,useUnifiedTopology: true}); 
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public/"))
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();//done for now 

/// passport configuration.
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//clearmiddleware
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//used to do remove campground from each route address as this common among all of them
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("Yelcamp has started");
});