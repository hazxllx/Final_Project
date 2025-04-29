// Import mongoose library
const mongoose = require('mongoose');

// Destructure Schema and model from mongoose
const { Schema, model } = mongoose;

// Define the structure of the User document
const UserSchema = new Schema({
  // Username must be a unique string, at least 4 characters long
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true,
  },
  // Password is required (should be hashed before saving)
  password: {
    type: String,
    required: true,
  },
  // Bookmarks is an array of Post IDs (references to the Post model)
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: [],
  }],
});

// Create the User model from the schema
const UserModel = model('User', UserSchema);

// Export the model for use in other parts of the app
module.exports = UserModel;
