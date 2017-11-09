import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  time:{type:Date,default:Date.now},
  userId:{ type: Schema.Types.ObjectId, ref:'user'},
  message:String,
  refId:{type:Schema.Types.ObjectId},
  description:String,
  link:String,
  saw:{type:Number,default:0},
  type:{type:Number,default:0}

});

module.exports = mongoose.model('notification', NotificationSchema);
