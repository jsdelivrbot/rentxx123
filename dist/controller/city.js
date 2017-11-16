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

var _city = require('../model/city');

var _city2 = _interopRequireDefault(_city);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    //adding a city
    //v1/city/add
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
                                var newcity = new _city2.default();
                                newcity.name = req.body.name;
                                newcity.save(function (err) {

                                    if (!err) {

                                        res.status(200).send({ message: "city added!" });
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

    //v1/city/update
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


                                _city2.default.findById(req.params.id, function (err, city) {

                                    if (!err) {
                                        if (city === undefined) {
                                            res.status(400).send({ message: "no such city exsist!" });
                                        } else {
                                            city.name = req.body.name;
                                            city.save(function (err) {

                                                if (err) {

                                                    res.status(500).send(err);
                                                } else {

                                                    res.status(200).send({ message: "city updated!" });
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

    //v1/city/update
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


                                _city2.default.findById(req.params.id, function (err, city) {

                                    if (!err) {
                                        if (city === undefined) {
                                            res.status(400).send({ message: "no such city exsist!" });
                                        } else {
                                            city.remove(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "city deleted!" });
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
//# sourceMappingURL=city.js.map