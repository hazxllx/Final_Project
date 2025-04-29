// Import mongoose library
const mongoose = require('mongoose');

// Destructure Schema and model from mongoose for cleaner syntax
const { Schema, model } = mongoose;

// Define the schema for a blog post
const PostSchema = new Schema({
  // Title of the post
  title: String,

  // Short summary of the post
  summary: String,

  // Full content of the post
  content: String,

  // Path or URL to the cover image
  cover: String,

  // Reference to the author (a user who created the post)
  author: {
    type: Schema.Types.ObjectId, // MongoDB ObjectId type
    ref: 'User',                // References the User model
  },
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true,
});

// Create the Post model based on the schema
const PostModel = model('Post', PostSchema);

// Export the model to be used in other parts of the app
module.exports = PostModel;
