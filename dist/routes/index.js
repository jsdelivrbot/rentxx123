'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _user = require('../controller/user');

var _user2 = _interopRequireDefault(_user);

var _login = require('../controller/login');

var _login2 = _interopRequireDefault(_login);

var _product = require('../controller/product');

var _product2 = _interopRequireDefault(_product);

var _category = require('../controller/category');

var _category2 = _interopRequireDefault(_category);

var _subCategory = require('../controller/subCategory');

var _subCategory2 = _interopRequireDefault(_subCategory);

var _bid = require('../controller/bid');

var _bid2 = _interopRequireDefault(_bid);

var _chat = require('../controller/chat');

var _chat2 = _interopRequireDefault(_chat);

var _college = require('../controller/college');

var _college2 = _interopRequireDefault(_college);

var _city = require('../controller/city');

var _city2 = _interopRequireDefault(_city);

var _notification = require('../controller/notification');

var _notification2 = _interopRequireDefault(_notification);

var _forgotpassword = require('../controller/forgotpassword');

var _forgotpassword2 = _interopRequireDefault(_forgotpassword);

var _requests = require('../controller/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

// connect to db
(0, _db2.default)(function (db) {

  // internal middleware
  router.use((0, _middleware2.default)({ config: _config2.default, db: db }));

  // api routes v1 (/v1)
  router.use('/user', (0, _user2.default)({ config: _config2.default, db: db }));
  //user will login here
  router.use('/login', (0, _login2.default)({ config: _config2.default, db: db }));
  //user will add delete update requests here
  router.use('/requests', (0, _requests2.default)({ config: _config2.default, db: db }));
  //user will add delete update product here
  router.use('/product', (0, _product2.default)({ config: _config2.default, db: db }));
  //admin will add delete  fetch products by category
  router.use('/category', (0, _category2.default)({ config: _config2.default, db: db }));
  //admin will add delete  fetch products by subcategory
  router.use('/subcategory', (0, _subCategory2.default)({ config: _config2.default, db: db }));
  //admin will add delete  fetch products by college
  router.use('/college', (0, _college2.default)({ config: _config2.default, db: db }));
  //admin will add delete  fetch products by city
  router.use('/city', (0, _city2.default)({ config: _config2.default, db: db }));
  //user will add delete update bid here
  router.use('/bid', (0, _bid2.default)({ config: _config2.default, db: db }));
  //user will add chat here
  router.use('/chat', (0, _chat2.default)({ config: _config2.default, db: db }));
  //user will notification here
  router.use('/notification', (0, _notification2.default)({ config: _config2.default, db: db }));
  //user will change password here
  router.use('/forgotpassword', (0, _forgotpassword2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map