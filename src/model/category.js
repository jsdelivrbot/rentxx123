import mongoose from 'mongoose';
import randToken from 'random-token';
let Schema = mongoose.Schema;

let CategorySchema = new Schema({
 name:String
  

});

module.exports = mongoose.model('category', CategorySchema);
