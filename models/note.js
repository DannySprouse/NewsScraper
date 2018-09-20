var mongoose = require("mongoose");

// Save a ref to the Schema constructor

var Schema = mongoose.Schema;

// Create a new note schema object

var NoteSchema = new Schema({
  title: String,
  body: String,
});

// Create model from above schema

var Note = mongoose.model("Note", NoteSchema);

// Export the Note model

module.exports = Note;