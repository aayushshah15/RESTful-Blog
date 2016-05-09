var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful-blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose/model/config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

Blog.create({
    title: "Test Blog",
    image: "",
    body: "Hello this is a blog!"
});

//RESTful routes

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if (err){
           console.log("Error!");
       } else {
           res.render("index", {blogs: blogs});
       }
   });
});

app.get("/", function(req,res){
    res.redirect("/blogs");
});

// NEW Route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//Create route
app.post("/blogs", function(req, res){
    // create the blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
    // redirect
});

// Show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});

