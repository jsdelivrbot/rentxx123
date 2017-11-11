import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let CitySchema = new Schema({
 name:String
  

});

module.exports = mongoose.model('city', CitySchema);
