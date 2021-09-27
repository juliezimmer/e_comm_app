const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
   res.send(signupTemplate({ req }));
});

// POST route handler //
router.post('/signup', 
   [
      check('email')
         .trim()
         .normalizeEmail()
         .isEmail(),
      check('password')
         .trim()
         .isLength({ min: 4, max: 20 }),
      check('confirmPassword')
         .trim()
         .isLength({ min: 4, max: 20 })
   ], 
   async (req, res) => {
   const errors = validationResult(req);
   console.log(errors);
   const { email, password, confirmPassword } = req.body;
   // create user - check email //
   const existingUser = await usersRepo.getOneBy({ email });
   if (existingUser) {
      return res.send('Email in use');
   }
   // check password //
   if(password !== confirmPassword){
      return res.send('Passwords must match');
   }

   // Create user in user repo to represent this person //
   const user = await usersRepo.create({ email, password });

   // store id of the user inside user's cookie //
   req.session.userId = user.id;

   // both validation checks have passed //
   res.send("Account created!");
});

router.get('/signout', (req, res) => {
   req.session = null;
   res.send('You are logged out');
});

router.get('/signin', (req, res) => {
   res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
   // destructuring form data //
   const { email, password } = req.body;
   
   // check for user email in db //
   const user = await usersRepo.getOneBy({ email }); 
   // if user with matching email NOT found:
   if (!user) { 
      return res.send('Email not found');     
   } 

   const validPassword = await usersRepo.comparePasswords(user.password, password);

   // email found - verify pw //
   if (!validPassword){
      return res.send('Invalid password');
   } 
   // if user gets past both checks, user is valid //
   // use id stored inside of cookie //  
   req.session.userId = user.id;
   res.send('You are signed in');
});

module.exports = router;