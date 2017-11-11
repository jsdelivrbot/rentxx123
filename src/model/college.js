import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let CollegeSchema = new Schema({
 name:String
  

});

module.exports = mongoose.model('college', CollegeSchema);
