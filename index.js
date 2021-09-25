const express = require('express');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users'); 

const app = express();

// body-parser //
app.use(express.urlencoded({ extended: true}));
app.use(cookieSession({
   keys:['randomSeriesOfCharacters']
}));

// Route Handler //
// handles account creation //
app.get('/signup', (req, res) => {
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
app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
   req.session = null;
   res.send('You are logged out');
});

app.get('/signin', (req, res) => {
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

app.post('/signin', async (req, res) => {
   // destructuring form data //
   const { email, password } = req.body;
   
   // check for user email in db //
   const user = await usersRepo.getOneBy({ email }); 
   // if user with matching email NOT found:
   if (!user) { 
      return res.send('Email not found');     
   } 
   // email found - verify pw //
   if (user.password !== password){
      return res.send('Invalid password');
   } 
   // if user gets past both checks, user is valid //
   // use id stored inside of cookie // 
   req.session.userId = user.id;
   res.send('You are signed in');

});

app.listen(3000, () => {
   console.log('Listening')
});