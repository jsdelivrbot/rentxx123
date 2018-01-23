import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let RequestSchema = new Schema({
  requestName: String,
  fromDate:Date,
  toDate:Date,
  image1:{type : String , default:"noImageFound"},
  image2:{type : String , default:"noImageFound"},
  image3:{type : String , default:"noImageFound"},
  image4:{type : String , default:"noImageFound"},
  referenceLink:{type:String},
  time:{type:Date,default:Date.now},
  college:{type:Schema.Types.ObjectId},
  city:{type:Schema.Types.ObjectId},
  description:{type:String,default:"N/A"},
  requestApproved:{type:Number,default:0},
  linkApproved:{type:Number,default:0},
  imageApproved:{type:Number,default:0},
  userId:{ type: Schema.Types.ObjectId, ref:'user'},
  lastEdit:{type:Date,default:Date.now},
  userName:{type:String},
  category:{type:Schema.Types.ObjectId},
  subCategory:{type:Schema.Types.ObjectId}
});

module.exports = mongoose.model('requests', RequestSchema);
