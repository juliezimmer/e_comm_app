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
   
     async getAll(){
      return JSON.parse(await fs.promises.readFile(this.filename, {encoding: 'utf8'}));
   }; 
     
}


// Test code //
const test = async () => {
   const repo = new UsersRepository('users.json');
   const users = await repo.getAll();

   console.log(users);
};

test();
