const Repository = require('./repository');

class ProductsRepository extends Repository {

}

// create instance of ProductsRepository and export it //
// products.json is where all the product information is saved//
module.exports = new ProductsRepository('products.json');