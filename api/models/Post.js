// Import Mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Destructure Schema and model from mongoose
const { Schema, model } = mongoose;

// Define the schema for a "Post" document in the MongoDB collection
const PostSchema = new Schema({
  // Title of the post
  title: String,

  // Short summary or excerpt of the post
  summary: String,

  // Full content/body of the post
  content: String,

  // Path or URL to the cover image associated with the post
  cover: String,

  // Reference to the User who created the post
  // This sets up a relationship to the User collection using ObjectId
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
  },
}, {
  // Automatically add `createdAt` and `updatedAt` timestamps
  timestamps: true,
});

// Create a model from the schema so it can be used elsewhere in the app
const PostModel = model('Post', PostSchema);

// Export the model to use it in other files (e.g., routes, controllers)
module.exports = PostModel;
