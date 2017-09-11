// Dependencies
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
// Requiring our Note and Article models
// const Note = require("./models/Note.js");
const Article = require("../models/Article.js");
const Comment = require("../models/Comment.js")
// Our scraping tools
const exphbs = require("express-handlebars");
const request = require("request");
const cheerio = require("cheerio");


router.get("/scrape", function(req, res){
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
      let entry = new Article(result);

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

router.get("/", function(req, res){
  Article.find({}, function(error, doc){
    let hbsObject = {};
    if(error){
      console.log(error);
    } else {
      hbsObject.article = doc;
      res.render("index", hbsObject);
    }
  });
});

router.get("/api/articles/saved", function(req, res){
  Article.find({saved:true},  function(error, doc){
    let hbsObject = {};
    if(error){
      console.log(error);
    } else {
      hbsObject.savedArticle = doc;
      res.render("saved", hbsObject);
    }
  });
});

router.put("/api/articles/savenew/:id", function(req, res) {

  Article.findOneAndUpdate({_id: req.params.id}, {$set:{
    saved: true
  }}, function(error, result){
    res.redirect("/");
  })
});

router.put("/api/articles/unsave/:id", function(req, res) {

  Article.findOneAndUpdate({_id: req.params.id}, {$set:{
    saved: false
  }}, function(error, result){
    res.redirect("/api/articles/saved");
  });
});

router.post("/api/articles/newcomment", function(req,res) {
  console.log(req.body)
  let newComment = new Comment(req.body);
  newComment.save(function(error, doc) {
    if(error) {
      res.send(error);
    } else {
      Article.findOneAndUpdate({}, { $push: {"comments": doc._id } }, { new: true }, function(err, newdoc)  {
        if(err) {
          res.send(err);
        } else {
          res.send(newdoc);
        }
      });
    }
  });
});



module.exports = router;