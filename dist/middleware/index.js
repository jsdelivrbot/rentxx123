'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  var app = (0, _express2.default)();
  // add middleware here
  app.set('views', __dirname + '/views');

  // Set EJS as the View Engine
  app.set('view engine', 'ejs');

  return api;
};
//# sourceMappingURL=index.js.map