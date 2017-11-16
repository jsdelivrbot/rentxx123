'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _randomToken = require('random-token');

var _randomToken2 = _interopRequireDefault(_randomToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
  fname: String,
  lname: { type: String, default: " " },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, default: "N/A" },
  password: String,
  college: { type: Schema.Types.ObjectId },
  image: String,
  occupation: { type: String, default: "N/A" },
  ratings: { type: Number, default: 0 },
  city: { type: Schema.Types.ObjectId },
  country: { type: String, default: "India" },
  location: { type: String, default: "N/A" },
  userType: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  emailverified: { type: Number, default: 0 },
  emailverificationkey: { type: String, default: function _default() {
      return (0, _randomToken2.default)(24);
    } }

});

module.exports = _mongoose2.default.model('user', UserSchema);
//# sourceMappingURL=user.js.map