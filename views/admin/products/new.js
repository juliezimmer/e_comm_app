const layout = require('../layout');
const { getErrors } = ('../../helpers');

module.exports = ({ errors }) => {
   return layout ({
      content:`
         <form method="POST" enctype="multipart/form-data">
            <input name="title" placeholder="Title">
            <input name="price" placeholder="Price">
            <input type="file" name="image">
            <button>Submit</button>
         </form>
      
      `
   });
}; 