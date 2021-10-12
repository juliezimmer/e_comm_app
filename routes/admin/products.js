const express = require('express');
const multer = require('multer');

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

// route for admin to list products //
router.get('/admin/products', (req, res) => {

});

// route handler to show form to create a new product //
router.get('/admin/products/new', (req, res) => {
   res.send(productsNewTemplate({}));
});

// route handler for new product form submission //
// 2nd argument is array of validators to run on form submission //
router.post(
   '/admin/products/new', 
   upload.single('image'),
   [requireTitle, requirePrice], 
   handleErrors(productsNewTemplate),
   async (req, res) => {
      // has uploaded image raw data that is being converted to a string encoded with base64 //
      const image = req.file.buffer.toString('base64'); 
      
      // get access to title and price from req.body //
      const { title, price } = req.body;
      await productsRepo.create({ title, price, image }); 

      res.send('submitted');
});

module.exports = router;