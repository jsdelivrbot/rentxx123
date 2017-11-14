import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let CollegeSchema = new Schema({
 name:String,
 city:{type:Schema.Types.ObjectId}
  

});

module.exports = mongoose.model('college', CollegeSchema);
