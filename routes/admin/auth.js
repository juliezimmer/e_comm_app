const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

router.get('/signup', (req, res) => {
   // greeting to user //
   res.send(`
      <div>
         Your id is: ${req.session.userId}
         <form method="POST"> 
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="confirmPassword" placeholder="confirm password">
            <button>Sign Up</button>
         </form>
      </div>
   `);
});

// POST route handler //
router.post('/signup', async (req, res) => {
   // destructure req.body //
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
   res.send(`
      <div>
         <form method="POST"> 
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <button>Sign In</button>
         </form>
      </div>
   `);
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