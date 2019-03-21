const express = require('express');
const router  = express.Router();
const Posts  = require('../models/posts');
const User   = require('../models/users');
//
// router.get('/dashboard',async (req,res)=>{
// 	const allPosts = await Posts.find({});
//
// 	res.render('dashboard.ejs', {
// 		posts: allPosts
// 	});
// });


router.post('/', async(req, res) => {
	if(req.session.loggedIn){
		//grab the loggedIn User
		const postAuthor = await User.findOne({username: req.session.username});
		console.log('POST AUTHOR', postAuthor);
		try {
			const newPost = await Posts.create(req.body);
			postAuthor.posts.push(newPost);
			const savedAuthor  = await postAuthor.save();
			res.redirect('/dashboard');

		} catch (error) {
			res.send(error);
		}
	} else {
		req.session.message = "Please login before create new posts"
		res.redirect('/login')
	}
})

//////COMMENTS SECTION//////////

router.post('/:id', async(req, res) => {
	try {
		const post = await Posts.findById(req.params.id);
		if (post) {
			post.comments.push(req.body.comments);
			post.save((err, savedPost) => {
				if (err) {
					res.send(err);
				} else {
					res.redirect(`/dashboard/${req.params.id}`);
				}
			});

		} else {
			res.send('<h1>No Post Found</h1>');
		}
	} catch (error) {
		res.send(error);
	}
})


router.delete('/:id', (req, res)=>{
  Posts.findByIdAndRemove(req.params.id, (err, deleted)=>{
		if (err) {
			res.send(err);
		} else {
			console.log(deleted)
			res.redirect('/dashboard')
		}
  });
});

router.get('/',async (req,res)=>{
	const allPosts = await Posts.find({});
	res.render('dashboard.ejs', {
		posts: allPosts,
	});
});


router.get('/:id', async (req, res) => {
	try {
		// const foundPost = await Posts.find({});
		Posts.findById(req.params.id, (err, foundPost)=>{
			User.findOne({'id': foundPost.userId},(err,foundUser)=>{
				console.log('POST AUTHOR ======= ', foundUser);
				if(err){
					res.send(err);
				} else {
					res.render('posts/index.ejs', {
						post: foundPost,
						user: foundUser
					});
				}
			});
	  });
	} catch (error) {
		res.send(error);
	};
});


module.exports = router;
