import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let RequestSchema = new Schema({
  requestName: String,
  numberOfDays:Number,
  image:{type : String , default:"noImageFound"},
  referenceLink:{type:String},
  time:{type:Date,default:Date.now},
  college:{type:String},
  description:{type:String,default:"N/A"},
  requestApproved:{type:Number,default:0},
  linkApproved:{type:Number,default:0},
  imageApproved:{type:Number,default:0},
  userId:{ type: Schema.Types.ObjectId, ref:'user'},
  lastEdit:{type:Date,default:Date.now}

});

module.exports = mongoose.model('requests', RequestSchema);
