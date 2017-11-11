import mongoose from 'mongoose';
import randToken from 'random-token';
let Schema = mongoose.Schema;

let ForgotpasswordSchema = new Schema({
 email:{type:String,required:true},
 key:{type:String,default: function() {
    return randToken(24);
}},
 time:{type:Date,default:Date.now}  
});

module.exports = mongoose.model('forgotpassword', ForgotpasswordSchema);
