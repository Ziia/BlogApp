var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
// APP Config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

//Model
var Blog = mongoose.model("Blog", blogSchema);

//  RESTFUL ROUTES
app.get("/", function(req, res) {

  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err);
    }else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.get("/blogs/new", function(req, res) {
  res.render("newPost");
});

// CREATE
app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newPost) {
    if(err) {
      res.render("new");
    }else {
      res.redirect("/blogs");
    }
  });
});

// SHOW
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundPost){
    if(err) {
      res.redirect("/blogs");
    }else {
      res.render("show", {blog: foundPost});
    }
  });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundPost) {
    if(err) {
      res.redirect("/blogs");
    }else {
      res.render("edit", {blog: foundPost});
    }
  });
});

// UPDATE
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundPost) {
    if(err){
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, foundPost){
    if(err){
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, function() {
  console.log("Server is running!");
});
