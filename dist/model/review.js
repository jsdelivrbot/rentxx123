'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  productId: { type: Schema.Types.ObjectId },
  value: Number,
  date: { type: Date, default: Date.now },
  description: String

});

module.exports = _mongoose2.default.model('review', ReviewSchema);
//# sourceMappingURL=review.js.map