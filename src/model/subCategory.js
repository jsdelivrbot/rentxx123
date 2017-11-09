import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SubCategorySchema = new Schema({
 name:String,
 category:{type:Schema.Types.ObjectId}
  

});

module.exports = mongoose.model('subCategory', SubCategorySchema);
