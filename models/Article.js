// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
const ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true,
    unique: true
  },
  timeAndSummary: {
    type: String,
    required: true,
    unique: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
