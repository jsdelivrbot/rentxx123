import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SpamSchema = new Schema({
  partId: String,
  epicNumber:String,
  age:{type:Number},
  gender:{type:Number},
  time:{type:Date,default:Date.now},
  documents:{type:Number},
  isVoted:{type:Number}

});

module.exports = mongoose.model('spam', SpamSchema);
