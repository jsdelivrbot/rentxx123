"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var RequestSchema = new Schema({
  requestName: String,
  numberOfDays: Number,
  image: { type: String, default: "noImageFound" },
  referenceLink: { type: String },
  time: { type: Date, default: Date.now },
  college: { type: Schema.Types.ObjectId },
  city: { type: Schema.Types.ObjectId },
  description: { type: String, default: "N/A" },
  requestApproved: { type: Number, default: 0 },
  linkApproved: { type: Number, default: 0 },
  imageApproved: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  lastEdit: { type: Date, default: Date.now }

});

module.exports = _mongoose2.default.model('requests', RequestSchema);
//# sourceMappingURL=requests.js.map