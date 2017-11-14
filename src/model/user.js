import mongoose from 'mongoose';
import randToken from 'random-token';
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  fname: String,
  lname:{type:String,default:" "},
  email:{type : String , unique : true, required : true},
  phoneNumber:{type:String,default:"N/A"},
  password:String,
  college:{type:Schema.Types.ObjectId},
  image:String,
  occupation:{type:String,default:"N/A"},
  ratings:{type:Number,default:0},
  city:{type:Schema.Types.ObjectId},
  country:{type:String,default:"India"},
  location:{type:String,default:"N/A"},
  userType:{type:Number,default:0},
  numberOfRatings:{type:Number,default:0},
  emailverified:{type:Number,default:0},
  emailverificationkey:{type:String,default: function() {
    return randToken(24);
}},

});

module.exports = mongoose.model('user', UserSchema);
