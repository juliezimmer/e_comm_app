const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
   constructor (filename) { // filename is where the users are stored - our db //
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
   }

   async create (attrs) {
      attrs.id = this.randomId();

      const salt = crypto.randomBytes(8).toString('hex');
      // hashes user's pw + salt combo //
      const buf = await scrypt(attrs.password, salt, 64); 
      
      const records = await this.getAll();
      const record = {
         ...attrs,
         password: `${buf.toString('hex')}.${salt}`
      }
      records.push(record); 
          
      await this.writeAll(records);

      return record; // has hashed and salted password //
   }

   async writeAll(records) {
      await fs.promises.writeFile(
         this.filename, 
         JSON.stringify(records, null, 2)
      );
   }

   randomId () {
      return crypto.randomBytes(4).toString('hex');   
   }

   async getOne (id) {
      // get all records out of users.json file //
      const records = await this.getAll();
      return records.find(record => record.id === id);
   }

   async delete(id) {
      const records = await this.getAll();
      const filteredRecords = records.filter(record => record.id !== id);
      await this.writeAll(filteredRecords);
   }

   async update(id, attrs) {
      const records = await this.getAll();
      const record = records.find(record => record.id === id);
      // check to see if matching record was found //
      if(!record) {
         throw new Error(`record with id of ${id} was not found`);
      }
      // update record that was found //
      Object.assign(record, attrs);
      // write records back to users.json //
      await this.writeAll(records);
   }

   async getOneBy(filters) {
      const records = await this.getAll();
      // iterate through records //
      for (let record of records){
         // temprorary variable //
         let found = true;
         for (let key in filters) {
            if (record[key] !== filters[key]) {
               found = false;
            }
         }

         if (found) {
            return record;
         }
      }
   }
}

module.exports = new UsersRepository('users.json'); 
