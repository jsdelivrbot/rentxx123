'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _notification = require('../model/notification');

var _notification2 = _interopRequireDefault(_notification);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //v1/notification/get
    api.post('/get', function (req, res) {
        //check password or match password token
        _user2.default.findOne({ email: req.body.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _login2.default.findOne({ email: req.body.email }, function (err, login) {

                    if (!err) {

                        if (login == undefined) {
                            //user not found

                            res.status(400).json({ message: 'User not Logged In!' });
                        } else {

                            if (login.token == req.body.token) {
                                //token matching and only admin can add

                                //checking if page number is correct
                                var pageNumber = 1;

                                if (!isNaN(req.body.page)) {
                                    pageNumber = req.body.page;
                                }
                                //async query start here
                                console.log("query started");
                                var countQuery = function countQuery(callback) {
                                    _notification2.default.find({ userId: user._id }, function (err, doc) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            callback(null, doc.length);
                                        }
                                    });
                                };

                                var retrieveQuery = function retrieveQuery(callback) {
                                    console.log((pageNumber - 1) * 12);
                                    _notification2.default.find({ userId: user._id }).skip((pageNumber - 1) * 12).sort({ time: -1 }).limit(12).exec(function (err, doc) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            callback(null, doc);
                                        }
                                    });
                                };

                                console.log(retrieveQuery);
                                _async2.default.parallel([countQuery, retrieveQuery], function (err, results) {
                                    //err contains the array of error of all the functions
                                    //results contains an array of all the results
                                    //results[0] will contain value of doc.length from countQuery function
                                    //results[1] will contain doc of retrieveQuery function
                                    //You can send the results as
                                    if (err) {
                                        // console.log("error here");
                                        res.status(500).send(err);
                                    } else {
                                        res.status(200).json({ total_pages: Math.floor(results[0] / 12 + 1), page: pageNumber, products: results[1] });
                                    }
                                });
                            } else {
                                res.status(400).json({ message: 'invalid token!' });
                            }
                        }
                    } else {

                        res.status(400).send(err);
                    }
                });
            }
        });
    });
    //v1/notification/
    api.post('/saw', function (req, res) {
        //check password or match password token
        _user2.default.findOne({ email: req.body.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _login2.default.findOne({ email: req.body.email }, function (err, login) {

                    if (!err) {

                        if (login == undefined) {
                            //user not found

                            res.status(400).json({ message: 'User not Logged In!' });
                        } else {

                            if (login.token == req.body.token) {
                                //token matching and only admin can add

                                _notification2.default.update({ userId: user._id }, { $set: { saw: 1 } }, { multi: true }, function (err, notification) {
                                    if (!err) {
                                        if (notification === undefined) {

                                            res.status(400).json({ message: "no notification found!" });
                                        } else {

                                            res.status(200).json({ message: "saw notifications!" });
                                        }
                                    } else {

                                        res.status(500).send(err);
                                    }
                                });
                            } else {
                                res.status(400).json({ message: 'invalid token!' });
                            }
                        }
                    } else {

                        res.status(400).send(err);
                    }
                });
            }
        });
    });
    return api;
};
//# sourceMappingURL=notification.js.map