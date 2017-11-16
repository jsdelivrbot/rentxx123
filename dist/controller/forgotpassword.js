'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _forgotpassword = require('../model/forgotpassword');

var _forgotpassword2 = _interopRequireDefault(_forgotpassword);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //v1/forgotpassword/get
    api.get('/add/:email', function (req, res) {
        //check password or match password token
        _user2.default.findOne({ email: req.body.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _forgotpassword2.default.findOne({ email: req.params.email }, function (err, forgotpassword) {

                    if (!err) {
                        if (forgotpassword == undefined) {

                            var newForgotpassword = new _forgotpassword2.default();
                            newForgotpassword.email = req.params.email;
                            newForgotpassword.save(function (err) {

                                if (!err) {

                                    res.status(200).json({ message: "added!" });
                                } else {

                                    res.status(500).send(err);
                                }
                            });
                        } else {
                            res.status(200).json({ message: "added!" });
                        }
                    } else {

                        res.status(500).send(err);
                    }
                });
            }
        });
    });
    //v1/forgotpassword/
    api.post('/change/:key/:email', function (req, res) {
        //check password or match password token
        _user2.default.findOne({ email: req.params.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _forgotpassword2.default.findOne({ email: req.params.email }, function (err, forgotpassword) {

                    if (!err) {

                        if (forgotpassword == undefined) {
                            //user not found

                            res.status(400).json({ message: 'Create a key again' });
                        } else {

                            if (forgotpassword.key == req.params.key) {
                                //token matching and only admin can add
                                //changing password here
                                _user2.default.findOne({ email: req.params.email }, function (err, user) {
                                    if (user === undefined) {
                                        res.status(400).json({ message: 'User not found!' });
                                    } else {
                                        user.password = req.body.password;
                                        user.save(function (err) {

                                            if (!err) {

                                                res.status(200).json({ message: "password changed" });
                                            } else {

                                                res.status(500).send(err);
                                            }
                                        });
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
//# sourceMappingURL=forgotpassword.js.map