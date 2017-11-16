'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// middleware
// parse application/json
app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));

// passport config

// api routes v1
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/assets', _express2.default.static(__dirname + '/public'));
app.use('/v1', _routes2.default);
app.get('/', function (req, res) {

  res.send("home");
});
app.server.listen(app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
}));

console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map