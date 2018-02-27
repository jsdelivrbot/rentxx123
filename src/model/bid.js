import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let BidSchema = new Schema({
  time:{type:Date,default:Date.now},
  userId:{ type: Schema.Types.ObjectId, ref:'user'},
  productById:{ type: Schema.Types.ObjectId, ref:'product'},
  productId:{ type: Schema.Types.ObjectId, ref:'product'},
  description:{type:String,default:"N/A"},
  amount:Number,
  days:Number, 
  userName:{type:String},
  productName:{type:String},
  isSpam:{type:Number,default:0},
  lastEdit:{type:Date,default:Date.now}

});

module.exports = mongoose.model('bid', BidSchema);
