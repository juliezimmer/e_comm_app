const fs = require('fs');

class UsersRepository {
   constructor (filename) { // filename is where the users are stored //
      if (!filename) {
         throw new Error('Filename required');
      }
      this.filename = filename;
      try { // checks for the file //
         fs.accessSync(this.filename);
      } catch (err) { // creates the file if it doesn't exist //
         fs.writeFileSync(this.filename, '[]');
      }
   }
   async getAll()
   // open this.filename //
      

}


// Test code //
new UsersRepository('users.json');