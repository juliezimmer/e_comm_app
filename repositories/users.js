const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');  

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
   async comparePasswords(saved, supplied){
      // saved -> pw saved in db. 'hashed.salt'
      // supplied -> pw provided by a user trying to signin
      // more compact version: this splits the hashed pw from the db at the period and puts the two parts in an array //
      const [hashed, salt] = saved.split('.');
      const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

      // comparison of pws //
      return hashed === hashedSuppliedBuffer.toString('hex');
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

   module.exports = new UsersRepository('users.json'); 
