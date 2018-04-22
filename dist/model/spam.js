'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var SpamSchema = new Schema({
  partId: String,
  epicNumber: String,
  age: { type: Number },
  gender: { type: Number },
  time: { type: Date, default: Date.now },
  documents: { type: Number },
  isVoted: { type: Number }

});

module.exports = _mongoose2.default.model('spam', SpamSchema);
//# sourceMappingURL=spam.js.map