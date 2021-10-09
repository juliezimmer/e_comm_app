const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

// serves public directory //
app.use(express.static('public'));

// body-parser //
app.use(express.urlencoded({ extended: true})) ;

app.use(cookieSession({
   keys:['randomSeriesOfCharacters']
}));

app.use(authRouter); 
app.use(productsRouter); 

app.listen(3000, () => {
   console.log('Listening');
});