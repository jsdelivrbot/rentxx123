'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _randomToken = require('random-token');

var _randomToken2 = _interopRequireDefault(_randomToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var LoginSchema = new Schema({
  email: { type: String, unique: true, required: true },
  token: {
    type: String,
    default: function _default() {
      return (0, _randomToken2.default)(5);
    }
  }, userType: Number,
  time: { type: Date, default: Date.now }

});

module.exports = _mongoose2.default.model('login', LoginSchema);
//# sourceMappingURL=login.js.map