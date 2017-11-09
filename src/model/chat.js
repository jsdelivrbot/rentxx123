import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ChatSchema = new Schema({
  time:{type:Date,default:Date.now},
  from:{ type: Schema.Types.ObjectId, ref:'user'},
  towards:{ type: Schema.Types.ObjectId, ref:'user'},
  chatId:String,
  message:String

});

module.exports = mongoose.model('chat', ChatSchema);
