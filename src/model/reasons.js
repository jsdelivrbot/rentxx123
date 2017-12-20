import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ReasonsSchema = new Schema({
 name:String
  

});

module.exports = mongoose.model('reasons', ReasonsSchema);
