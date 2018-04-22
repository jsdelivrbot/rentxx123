'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _spam = require('../model/spam');

var _spam2 = _interopRequireDefault(_spam);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _pusher = require('pusher');

var _pusher2 = _interopRequireDefault(_pusher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  //adding a city
  //v1/city/add
  var pusher = new _pusher2.default({
    appId: '513442',
    key: 'dd20d8a12a2c4b1c7960',
    secret: 'fde09d5acecffcb9f07d',
    cluster: 'ap2',
    encrypted: true
  });
  api.post('/add', function (req, res) {
    //check password or match password
    //token matching and only admin can add
    var spam = new _spam2.default();
    spam.gender = req.body.gender;
    spam.partId = req.body.partId;
    spam.age = req.body.age;
    spam.epicNumber = req.body.epicNumber;
    spam.isVoted = req.body.isVoted;
    spam.document = req.body.document;
    spam.save(function (err, spam_got) {

      if (!err) {
        pusher.trigger('os-poll', 'os-vote', {
          gender: req.body.gender,
          partId: req.body.partId,
          age: req.body.age,
          isVoted: req.body.isVoted,
          document: req.body.document
        });
        res.status(200).send(spam_got);
      } else {
        res.status(500).send(err);
      }
    });
  });

  //get cities here
  api.post('/get', function (req, res) {
    _spam2.default.find({}, function (err, spams) {
      res.json({ "spams": spams });
    });
  });
  return api;
};
//# sourceMappingURL=spam.js.map