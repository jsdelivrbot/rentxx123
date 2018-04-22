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

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/v1/login/add'
    api.post('/add', function (req, res) {
        //check password or match password
        _user2.default.findOne({ email: req.body.email }, function (err, user) {

            if (!err) {

                if (user == undefined) {
                    //user not found

                    res.status(400).json({ message: 'User not found!' });
                } else {

                    if (user.password === req.body.password) {
                        //password matching
                        if (user.emailverified == 1) {
                            //checking if user is already logged in
                            _login2.default.findOne({ email: req.body.email }, function (err, loginDetails) {

                                if (!err) {
                                    if (loginDetails === null) {
                                        //user is not already logged in
                                        //saving login new details
                                        var newLogin = new _login2.default();
                                        newLogin.email = req.body.email;
                                        newLogin.userType = user.userType;
                                        newLogin.save(function (err, loginDetailsAfterSaving) {

                                            if (err) {

                                                res.status(500).send(err);
                                            }
                                            var a = user.toJSON();
                                            a.token = loginDetailsAfterSaving.token;

                                            var token = _jsonwebtoken2.default.sign(a, "example1");
                                            res.status(200).json({ token: token });
                                        });
                                    } else {
                                        //user is already logged in
                                        var a = user.toJSON();
                                        a.token = loginDetails.token;

                                        var token = _jsonwebtoken2.default.sign(a, "example1");
                                        res.status(200).json({ token: token });
                                    }
                                } else {

                                    res.status(500).send(err);
                                }
                            });
                        } else {
                            res.status(400).json({ message: 'user not verified!' });
                        }
                    } else {
                        res.status(400).json({ message: 'invalid password!' });
                    }
                }
            }
        });
    });
    //logging out a user
    api.delete('/logout/:email/:token', function (req, res) {
        _login2.default.findOne({ email: req.params.email }, function (err, login) {
            if (!err) {
                if (login === null) {
                    res.status(400).json({ message: 'User not found!' });
                } else {
                    if (login.token === req.params.token) {
                        login.remove(function (err) {
                            if (err) {

                                res.send(err);
                            }
                            res.status(200).json({ message: 'User logged out successfully' });
                        });
                    } else {
                        res.status(400).json({ message: 'Wrong token' });
                    }
                }
            } else {

                res.status(500).send(err);
            }
        });
    });
    return api;
};
//# sourceMappingURL=login.js.map