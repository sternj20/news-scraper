/* Scrape and Display
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Requiring our Note and Article models
// var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
var methodOverride = require('method-override');
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Use morgan and body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(methodOverride('_method'))

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsdb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get("/scrape", function(req, res){
  // Make a request call to grab the HTML body from the site of your choice
  request("http://www.npr.org/sections/news/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  const $ = cheerio.load(html);

  const result = {};

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $(".has-image").each(function(i, element) {
    result.title = $(element).children(".item-info").children(".title").children("a").text();
    result.link = $(element).children(".item-info").children(".title").children("a").attr("href");
    result.timeAndSummary = $(element).children(".item-info").children(".teaser").children("a").text();
          // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  // Tell the browser that we finished scraping the text
  res.redirect("./")
});
});

app.get("/", function(req, res){
  Article.find({}, function(error, doc){
    const hbsObject = {};
    if(error){
      console.log(error);
    } else {
      hbsObject.article = doc;
      res.render("index", hbsObject);
    }
  });
});


app.put("/:id", function(req, res) {

  Article.findOneAndUpdate({_id: req.params.id}, {$set:{
    saved: true
  }}, function(error, result){
    res.redirect("/");
  })
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
