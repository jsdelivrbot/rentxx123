'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _randomToken = require('random-token');

var _randomToken2 = _interopRequireDefault(_randomToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ForgotpasswordSchema = new Schema({
  email: { type: String, required: true },
  key: { type: String, default: function _default() {
      return (0, _randomToken2.default)(24);
    } },
  time: { type: Date, default: Date.now }
});

module.exports = _mongoose2.default.model('forgotpassword', ForgotpasswordSchema);
//# sourceMappingURL=forgotpassword.js.map