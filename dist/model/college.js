'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var CollegeSchema = new Schema({
  name: String,
  city: { type: Schema.Types.ObjectId }

});

module.exports = _mongoose2.default.model('college', CollegeSchema);
//# sourceMappingURL=college.js.map