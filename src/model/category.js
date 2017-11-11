import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let CategorySchema = new Schema({
 name:String
  

});

module.exports = mongoose.model('category', CategorySchema);
