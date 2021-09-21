const express = require('express');

const app = express();

// body-parser //
app.use(express.urlencoded({ extended: true}));

// Route Handler //
app.get('/', (req, res) => {
   // greeting to user //
   res.send(`
      <div>
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
app.post('/', (req, res) => {
   console.log(req.body); // formData
   res.send("Account created!");
});

app.listen(3000, () => {
   console.log('Listening')
});