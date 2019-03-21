const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const postsController = require('./controllers/posts');
const usersController = require('./controllers/users');
const PORT = process.env.PORT || 3000;

const session = require('express-session');
require('./db/db');
const Users  = require('./models/users');
const Posts = require('./models/posts');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret:"this is a random string secret",
	resave: false,
	saveUninitialized: false
}));

app.use(express.static(__dirname + '/public'));

app.use('/users', usersController);

app.use('/dashboard', postsController);


//////////////////////////

app.get('/',(req,res)=>{
	res.render('index.ejs')
});


app.get('/login',(req,res)=>{
	res.render('login.ejs',{
		message: req.session.message
	})
});

app.get('/signup',(req,res)=>{
	res.render('signup.ejs')
});

app.get('/newpost',(req,res)=>{
	res.render('posts/newpost.ejs')
});

app.get('/home',(req,res)=>{
	res.render('index.ejs')
});

app.get('/resource', (req, res) => {
	const hotlines = [
		{
			title: "Depression hotlines",
			links: [
				"National Suicide Prevention Lifeline: 1-800-273-8255 (TALK)", "The Samaritans: (877) 870-4673 (HOPE)", "Crisis Support Services - 1-800-273-8255"
			]
		},
		{
			title: "Anxiety Hotlines",
			links: []
		},
		{
			title: "LGBTQ Hotlines",
			links: [
				"Trevor Project Lifeline – Hotline for LGBT youth 866-488-7386"
			]
		}
	];

	res.render('resource.ejs', {
		hotlines
	})
})

app.listen(PORT, () => {
  console.log('App is listening on port 3000');
});
