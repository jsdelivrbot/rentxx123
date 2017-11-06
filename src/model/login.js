import mongoose from 'mongoose';
import randToken from 'random-token';
let Schema = mongoose.Schema;

let LoginSchema = new Schema({
  email:{type : String , unique : true, required : true},
  token: {
    type: String,
    default: function() {
        return randToken(5);
    }
},userType:Number,
time:{type:Date,default:Date.now}
  

});

module.exports = mongoose.model('login', LoginSchema);
