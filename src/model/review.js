import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ReviewSchema = new Schema({
  userId:{type:Schema.Types.ObjectId},
  productId:{type:Schema.Types.ObjectId},
  value:Number,
  date:{type:Date,default:Date.now},
  description:String

});

module.exports = mongoose.model('review', ReviewSchema);
