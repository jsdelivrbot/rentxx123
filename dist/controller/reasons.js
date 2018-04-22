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

var _product = require('../model/product');

var _product2 = _interopRequireDefault(_product);

var _reasons = require('../model/reasons');

var _reasons2 = _interopRequireDefault(_reasons);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    //adding a reasons
    //v1/reasons/add
    api.post('/add', function (req, res) {
        //check password or match password
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

                            if (login.token == req.body.token && user.userType > 0) {
                                //token matching and only admin can add
                                var newreasons = new _reasons2.default();
                                newreasons.name = req.body.name;
                                newreasons.save(function (err, reasons) {

                                    if (!err) {

                                        res.status(200).send(reasons);
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

    //v1/reasons/update
    api.put('/update/:id', function (req, res) {
        //check password or match password
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

                            if (login.token == req.body.token && user.userType > 0) {
                                //token matching and only admin can add


                                _reasons2.default.findById(req.params.id, function (err, reasons) {

                                    if (!err) {
                                        if (reasons === undefined) {
                                            res.status(400).send({ message: "no such reasons exsist!" });
                                        } else {
                                            reasons.name = req.body.name;
                                            reasons.save(function (err) {

                                                if (err) {

                                                    res.status(500).send(err);
                                                } else {

                                                    res.status(200).send({ message: "reasons updated!" });
                                                }
                                            });
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

    //v1/reasons/delete
    api.delete('/delete/:id/:token/:email', function (req, res) {
        //check password or match password
        _user2.default.findOne({ email: req.params.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _login2.default.findOne({ email: req.params.email }, function (err, login) {

                    if (!err) {

                        if (login == undefined) {
                            //user not found

                            res.status(400).json({ message: 'User not Logged In!' });
                        } else {

                            if (login.token == req.params.token && user.userType > 0) {
                                //token matching and only admin can add


                                _reasons2.default.findById(req.params.id, function (err, reasons) {

                                    if (!err) {
                                        if (reasons === undefined) {
                                            res.status(400).send({ message: "no such reasons exsist!" });
                                        } else {
                                            reasons.remove(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "reasons deleted!" });
                                                } else {

                                                    res.status(500).send(err);
                                                }
                                            });
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

    //get reasons here
    api.post('/get', function (req, res) {
        _reasons2.default.find({}, function (err, reasons) {
            res.json({ "cities": reasons });
        });
    });
    return api;
};
//# sourceMappingURL=reasons.js.map