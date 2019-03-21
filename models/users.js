const mongoose = require('mongoose');
const Posts = require('../models/posts');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
	username: String,
	password: String,
	posts: [Posts.schema]
});

const User = mongoose.model('User',userSchema);
module.exports = User;
