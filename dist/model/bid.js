'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var BidSchema = new Schema({
  time: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  productId: { type: Schema.Types.ObjectId, ref: 'product' },
  description: { type: String, default: "N/A" },
  amount: Number,
  days: Number,
  isSpam: { type: Number, default: 0 },
  lastEdit: { type: Date, default: Date.now }

});

module.exports = _mongoose2.default.model('bid', BidSchema);
//# sourceMappingURL=bid.js.map