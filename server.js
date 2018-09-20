// Dependencies

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

// Scraping tools

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models

var db = require("./models");

var PORT = 8080;

// Initialize Express

var app = express();

// Use morgan logger to log requests

app.use(logger("dev"));

// Use body-parser for form submissions

app.use(bodyParser.urlencoded({extended: true}));

// Use express.static to serve up the public folder as static directory

app.use(express.static("public"));

// Connect to Mongo DB

mongoose.connect("mongodb://localhost/NewsScraper", {
  useNewUrlParser: true });

// Routes

  // GET route for scraping the NYT website

app.get("/scrape", function(req, res) {
  // Grab html body
  axios.get("http://www.nytimes.com/").then(function(response) {
  // Load into cheerio
    var $ = cheerio.load(response.data);
  // Grab all h2 article tags
    $("article h2").each(function(i, element) {
  // Save an empty result object
      var result = {};

  // Add text and href of all links and save as properties of the result object
  result.title = $(this)
      .children("a")
      .text();
  result.link = $(this)
      .children("a")
      .attr("href");

  // Create new Article using the result object
  db.Article.create(result)
      .then(function(dbArticle) {
        // View result
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If error, return
        return res.json(err);
      });
  });
      // If return is successful
      res.send("Scrape Complete");
    });
  });

  // Route to get Articles from db
  app.get("/articles", function(req,res) {
    Article.find({}).limit(10).exec(function(error, doc) {
      if(error) {
        console.log(error);
      }
      else {
        res.json(doc);
      }
    });
  });

  // Route for grabbing an article by ID
  app.get("/articles/:id", function(req,res){
    Article.findOne({ "_id": req.params.id})
    .populate("note")
    .exec(function(error, doc){
      if(error){
        console.log(error);
      }
      else{
        res.json(doc);
      }
    });
  });

  // Route for saving/updating Article's note
  app.post("/articles/save/:id", function(req,res){
    Article.findOneAndUpdate({ "_id": req.params.id}, {"saved": true})
    .exec(function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        res.send(doc);
      }
    });
  });

  // Route for deleting Article's note
  app.post("/articles/delete/:id", function(req,res){
    Article.findOneAndUpdate({ "_id": req.params.id}, {"saved": false, "notes":[]})
    .exec(function(err, doc){
      if(err){
        console.log(err);
      }
      else{
        res.send(doc);
      }
    });
  });

// Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

