const express = require('express');

const app = express();

// Route Handler //
app.get('/', (req, res) => {
   // greeting to user //
   res.send(`
      <div>
         <form>
            <input placeholder="email">
            <input placeholder="password">
            <input placeholder="password confirmation">
            <button>Sign Up</button>
         </form>
      </div>
   `);
});

app.listen(3000, () => {
   console.log('Listening')
});