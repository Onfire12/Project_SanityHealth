const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  topic: String,
  body: String,
  comments: [String]
});

const Posts = mongoose.model('Posts', postSchema)

module.exports = Posts;
