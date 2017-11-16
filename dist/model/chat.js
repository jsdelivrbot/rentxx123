'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ChatSchema = new Schema({
  time: { type: Date, default: Date.now },
  from: { type: Schema.Types.ObjectId, ref: 'user' },
  towards: { type: Schema.Types.ObjectId, ref: 'user' },
  chatId: String,
  message: String

});

module.exports = _mongoose2.default.model('chat', ChatSchema);
//# sourceMappingURL=chat.js.map