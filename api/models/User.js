// Import Mongoose to work with MongoDB
const mongoose = require('mongoose');

// Get Schema and model from mongoose
const { Schema, model } = mongoose;

// Define the schema for a "User" document
const UserSchema = new Schema({
  // Username must be a string, is required, must be at least 4 characters, and must be unique
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true, // Prevents duplicate usernames
  },

  // Password is required; this will usually be a hashed password
  password: {
    type: String,
    required: true,
  },
});

// Create a model named 'User' using the UserSchema
const UserModel = model('User', UserSchema);

// Export the model to be used in other parts of the application
module.exports = UserModel;
