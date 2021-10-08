const { check } = require ('express-validator');
const usersRepo = require ('../../repositories/users');

module.exports = {
   requireEmail: check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .custom(async (email) => {
         const existingUser = await usersRepo.getOneBy({ email });
         if (existingUser) {
            throw new Error('Email in use');
         }
      }),
   requirePassword: check('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Must be between 4 and 20 characters'),
   requireConfirmPassword: check('confirmPassword')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Must be between 4 and 20 characters')
      .custom((confirmPassword, { req }) => {
         if(confirmPassword !== req.body.password){
            throw new Error('Passwords must match');    
         }
         return true;
      }),
   requireEmailExists: check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must provide valid email')
      .custom(async (email) => {
         const user = await usersRepo.getOneBy({ email });
         // if a user was not found in db:
         if (!user) {
            throw new Error('Email not found');
         }
      }),
   requireValidPasswordForUser: check('password')
      .trim()
      .custom(async (password, { req }) => {
         const user = await usersRepo.getOneBy({ email: req.body.email });
         if (!user){
            throw new Error('Invalid password');
         }
         // returns a boolean //
         const validPassword = await usersRepo.comparePasswords(user.password, password);

         if (!validPassword){
            throw new Error ('Invalid password');
         } 
      })         
};