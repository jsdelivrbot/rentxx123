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

var _college = require('../model/college');

var _college2 = _interopRequireDefault(_college);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    //adding a college
    //v1/college/add
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
                                var newcollege = new _college2.default();
                                newcollege.name = req.body.name;
                                newcollege.city = req.body.city;
                                newcollege.save(function (err) {

                                    if (!err) {

                                        res.status(200).send({ message: "college added!" });
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

    //v1/college/update
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


                                _college2.default.findById(req.params.id, function (err, college) {

                                    if (!err) {
                                        if (college === undefined) {
                                            res.status(400).send({ message: "no such college exsist!" });
                                        } else {
                                            college.name = req.body.name;
                                            college.city = req.body.city;
                                            college.save(function (err) {

                                                if (err) {

                                                    res.status(500).send(err);
                                                } else {

                                                    res.status(200).send({ message: "college updated!" });
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

    //v1/college/update
    api.delete('/delete/:id', function (req, res) {
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


                                _college2.default.findById(req.params.id, function (err, college) {

                                    if (!err) {
                                        if (college === undefined) {
                                            res.status(400).send({ message: "no such college exsist!" });
                                        } else {
                                            college.remove(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "college deleted!" });
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
    return api;
};
//# sourceMappingURL=college.js.map