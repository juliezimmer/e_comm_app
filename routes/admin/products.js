const express = require('express');
const { validationResult } = require('express-validator');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// route for admin to list products //
router.get('/admin/products', (req, res) => {

});

// route handler to show form to create a new product //
router.get('/admin/products/new', (req, res) => {
   res.send(productsNewTemplate({}));
});

// route handler that handles new product form submission //
// 2nd argument is array of validators to run on form submission //
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
   const errors = validationResult(req);
   console.log(errors);
   res.send('submitted');
});

module.exports = router;