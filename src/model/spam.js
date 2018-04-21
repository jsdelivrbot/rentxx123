import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SpamSchema = new Schema({
  partId: String,
  epicNumber:String,
  age:{type:Number},
  gender:{type:String},
  time:{type:Date,default:Date.now},
  documents:String,
  isVoted:String

});

module.exports = mongoose.model('spam', SpamSchema);
