var mongoose = require("mongoose");

// Save ref to Schema constructor

var Schema = mongoose.Schema;

// Using the Schema constructor, create a user object

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create model from the schema

var Article = mongoose.model("Article", ArticleSchema);

// Export Article model

module.exports = Article;