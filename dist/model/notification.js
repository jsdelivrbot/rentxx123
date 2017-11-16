'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var NotificationSchema = new Schema({
  time: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  message: String,
  refId: { type: Schema.Types.ObjectId },
  description: String,
  link: String,
  saw: { type: Number, default: 0 },
  type: { type: Number, default: 0 }

});

module.exports = _mongoose2.default.model('notification', NotificationSchema);
//# sourceMappingURL=notification.js.map