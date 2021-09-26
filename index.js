const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

// body-parser //
app.use(express.urlencoded({ extended: true})) ;

app.use(cookieSession({
   keys:['randomSeriesOfCharacters']
}));

app.use(authRouter);  

app.listen(3000, () => {
   console.log('Listening');
});