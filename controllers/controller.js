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

const mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

router.get("/scrape", function(req, res){
  // Make a request call to grab the HTML body from the site of your choice
  request("http://www.npr.org/sections/news/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  const $ = cheerio.load(html);

  const result = {};
  $(".has-image").each(function(i, element) {
    result.title = $(element).children(".item-info").children(".title").children("a").text();
    result.link = $(element).children(".item-info").children(".title").children("a").attr("href");
    result.timeAndSummary = $(element).children(".item-info").children(".teaser").children("a").text();
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

router.get("/api/articles/saved/", function(req, res){
  let hbsObject = {};
  Article.find({saved:true}, function(error, doc){
    if (error) {
      res.send(error);
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
  });
});

router.put("/api/articles/unsave/:id", function(req, res) {
  Article.findOneAndUpdate({_id: req.params.id}, {$set:{
    saved: false
  }}, function(error, result){
    res.redirect("/api/articles/saved");
  });
});

router.get("/api/articles/newcomment/:id", function(req, res) {
  Article.find({_id:req.params.id})
    // ..and on top of that, populate the notes (replace the objectIds in the notes array with bona-fide notes)
    .populate("comments")
    // Now, execute the query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      } else {
        res.send(doc[0].comments);
      }
    });
  });

router.post("/api/articles/newcommentsubmit/:id?", function(req,res) {
  let comment = {comment: req.body.commentContent};
  let newComment = new Comment(comment);
  newComment.save(function(error, doc) {
    if(error) {
      res.send(error);
    } else {
      Article.findOneAndUpdate({_id:req.params.id}, { $push: {"comments": doc._id } }, { new: true }, function(err, newdoc)  {
        if(err) {
          res.send(err);
        } else {
          res.redirect("/api/articles/saved");
        }
      });
    }
  });
});



module.exports = router;