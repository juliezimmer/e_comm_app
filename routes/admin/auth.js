const express = require('express');
const { check, validationResult, body } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requireConfirmPassword } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
   res.send(signupTemplate({ req }));
});

// POST route handler //
router.post('/signup', 
   [ requireEmail,  requirePassword, requireConfirmPassword ], 
   async (req, res ) => {
      const errors = validationResult(req);
      
      // check to see if errors occurred //
      if(!errors.isEmpty()) {
         return res.send(signupTemplate({ req, errors }));
      }
      
      const { email, password, confirmPassword } = req.body;
      // Create user in user repo //
      const user = await usersRepo.create({ email, password });

      // store id of the user inside user's cookie //
      req.session.userId = user.id;

      res.send("Account created!");
   }
);

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