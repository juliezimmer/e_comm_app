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

   async create (attrs) {
      const records = await this.getAll();
      records.push(attrs);

      await this.writeAll(records);
   }

   async writeAll(records) {
      await fs.promises.writeFile(
         this.filename, 
         JSON.stringify(records, null, 2)
      );
   }
}


// Test code //
const test = async () => {
   const repo = new UsersRepository('users.json');
   
   await repo.create({ email: 'test@test.com', password: 'password' });
   
   const users = await repo.getAll();

   console.log(users);
};

test();
