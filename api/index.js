// Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' }); // File upload destination
const fs = require('fs');

// Generate salt for password hashing
const salt = bcrypt.genSaltSync(10);

// Secret key for JWT
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// Middleware setup
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Allow frontend access
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use('/uploads', express.static(__dirname + '/uploads')); // Serve uploaded files

// Connect to MongoDB database
mongoose.connect('mongodb+srv://hazel:holyshit@cluster0.vhnu0bv.mongodb.net/fp?retryWrites=true&w=majority&appName=Cluster0');

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// Login a user and return a JWT token in a cookie
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json('User not found');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) return res.status(500).json('Token signing failed');
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('Wrong credentials');
  }
});

// Get user profile using JWT token from cookie
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json('Invalid or expired token');
    }
    res.json(info);
  });
});

// Logout user by clearing token cookie
app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

// Create a new post (with file upload)
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json('Unauthorized');

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
});

// Update an existing post (optional file upload)
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json('Unauthorized');

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

// Get all posts (latest 20, with author info)
app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

// Get a single post by ID (with author info)
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
