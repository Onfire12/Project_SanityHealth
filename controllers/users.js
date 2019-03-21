const express = require('express');
const router  = express.Router();
const User  = require('../models/users');
const Posts   = require('../models/posts');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
  console.log('In Reg ===================', req.body);
  const password = req.body.password;
  const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = {};
  newUser.username = req.body.username;
  newUser.password = hashedPassword;

  try {
    console.log('In New User ===================', newUser);
    const createdUser = await User.create(newUser);
    console.log('CREATED USER =============== ', createdUser);
    req.session.username = createdUser.username;
    req.session.loggedIn = true;
    console.log('In User Session ===================', req.session);
    res.redirect('/dashboard');
    console.log('AFTER REDIRECT')
  } catch (err) {
    res.send(err)
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log("find username +++++++++++");
    const foundUser = await User.findOne({username: req.body.username});
    if(foundUser){
      console.log("========check UserName&Password===");
      if(bcrypt.compareSync(req.body.password, foundUser.password)){
        req.session.message = '';
        req.session.username = foundUser.username;
        req.session.loggedIn = true;
        console.log(req.session);
        res.redirect('/dashboard');
      }else{
        console.log("=======username&password Incorrect")
        req.session.message ='Username or password are incorrect';
        res.redirect('/login');
      }
    }else {
      console.log("=======username&password Incorrect")
      req.session.message ='Username or password are incorrect';
      res.redirect('/login');
    }
  }

  catch(err){
    console.log(err);
    res.send(err)
  };
})


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
    } else {
      console.log("=====logOUt========",req.session)
      res.redirect('/');
    }
  })
});

  //User Index
router.get('/',(req,res)=>{
  User.find({},(err,allUsers)=>{
    res.render('users/index.ejs',{
      users: allUsers
    })
  })
});

  //show users
router.get('/:id',(req,res)=>{
  User.findById(req.params.id,(err,foundUser)=>{
    if(err) throw err;
    Posts.findOne({'users._id': req.params.id},(err, foundPost)=>{
      if(err){
        res.send(err)
      }else{
        res.render('users/show.ejs',{
          user:foundUser,
          post:foundPost
        })
      }
    });
  });
});

  //edit users
router.get('/:id/edit', (req,res)=>{
  User.findById(req.params.id,(err,foundUser)=>{
    if(err){
      res.send(err)
    }else{
      res.render('users/edit.ejs', {
        user: foundUser
      })
    }
  })
});

router.post('/', (req,res)=>{
  User.create(req.body,(err,createUser)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect('/users')
    }
  })
});

router.put('/:id', (req,res)=>{
  User.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,updatedUser)=>{
    if(err){
      res.send(err)
    }else{
      res.redirect(`/users/${req.params.id}`)
    }
  })
})

  //delete
  router.delete('/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id,(err,foundUser)=>{
      res.redirect('/users')
    })
  });

module.exports = router;
