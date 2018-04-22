'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _product = require('../model/product');

var _product2 = _interopRequireDefault(_product);

var _bid = require('../model/bid');

var _bid2 = _interopRequireDefault(_bid);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _notification = require('../model/notification');

var _notification2 = _interopRequireDefault(_notification);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/v1/bid/add/emailID'
    api.post('/add', function (req, res) {
        //check token match token
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
                                //token matching
                                _product2.default.findOne({ _id: req.body.productId }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            var newBid = new _bid2.default();
                                            newBid.amount = req.body.amount;
                                            newBid.days = req.body.days;
                                            newBid.productId = req.body.productId;
                                            newBid.userId = user._id;
                                            newBid.description = req.body.description;
                                            newBid.userName = req.body.userName;
                                            newBid.productName = req.body.productName;
                                            newBid.productById = product.userId;
                                            newBid.save(function (err, bid) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = product.userId;
                                                    newNotification.message = "Bid added!";
                                                    newNotification.description = "You have recieved Bid on " + product.productName;
                                                    newNotification.type = 3;
                                                    newNotification.refId = product._id;
                                                    newNotification.link = "/product";
                                                    newNotification.save();
                                                    _user2.default.findById(product.userId, function (err, ownerUser) {

                                                        if (!err) {
                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/bidrecieved.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Bid Recieved!', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Bid Recieved!", name: ownerUser.fname, productName: product.productName, byperson: user.fname }, function (err) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    }
                                                                })

                                                            };
                                                            transporter.sendMail(mailOptions, function (err, info) {
                                                                if (err) console.log(err);else console.log(info);
                                                            });
                                                            //sending mail ends
                                                        } else {
                                                            console.log(err);
                                                        }
                                                    });

                                                    res.status(200).json(bid);
                                                } else {

                                                    res.status(400).send({ message: "bid was not saved" });
                                                }
                                            });
                                        }
                                    } else {

                                        res.status(400).send(err);
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

    // '/v1/bid/update/bidId 
    api.put('/update/:id', function (req, res) {
        //check password or match password
        _user2.default.findOne({ email: req.body.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _login2.default.findOne({ email: req.body.email }, function (err, login) {

                    if (!err) {

                        if (login == undefined) {
                            //user not found in login table

                            res.status(400).json({ message: 'User not Logged In!' });
                        } else {

                            if (login.token == req.body.token) {
                                //token matching
                                _bid2.default.findOne({ _id: req.params.id }, function (err, bid) {

                                    if (!err) {
                                        if (bid === undefined) {

                                            res.status(400).send({ message: "no such bid exsist" });
                                        } else {
                                            if (user._id.equals(bid.userId) || login.userType > 0) {
                                                //here user who created the product can make changes and the admin

                                                bid.amount = req.body.amount;
                                                bid.days = req.body.days;
                                                bid.description = req.body.description;
                                                bid.lastedit = Date();
                                                bid.save(function (err, bid) {

                                                    if (!err) {

                                                        res.status(200).send(bid);
                                                    } else {

                                                        res.status(400).send({ message: "bid was not saved" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to update bid" });
                                            }
                                        }
                                    } else {

                                        res.status(400).send(err);
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
    // '/v1/bid/delete/bidId 
    api.delete('/delete/:id', function (req, res) {
        //check password or match password
        _user2.default.findOne({ email: req.body.email }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not found!' });
            } else {
                _login2.default.findOne({ email: req.body.email }, function (err, login) {

                    if (!err) {

                        if (login == undefined) {
                            //user not found in login table

                            res.status(400).json({ message: 'User not Logged In!' });
                        } else {

                            if (login.token == req.body.token) {
                                //token matching
                                _bid2.default.findOne({ _id: req.params.id }, function (err, bid) {

                                    if (!err) {
                                        if (bid === undefined) {

                                            res.status(400).send({ message: "no such bid exsist" });
                                        } else {
                                            if (user._id.equals(bid.userId) || login.userType > 0) {
                                                //here user who created the product can make changes and the admin


                                                bid.remove(function (err, bid) {

                                                    if (!err) {

                                                        res.status(200).json({ message: "bid deleted successfully!" });
                                                    } else {

                                                        res.status(400).send({ message: "bid was not deleted" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to update bid" });
                                            }
                                        }
                                    } else {

                                        res.status(400).send(err);
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
    // '/v1/bid/marasspam/bidId 
    api.put('/markasspam/:id', function (req, res) {
        //check tokenr match token
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
                                //token matching
                                _product2.default.findOne({ _id: req.body.productId }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {
                                            _bid2.default.findOne({ _id: req.params.id }, function (err, bid) {
                                                if (bid === undefined) {

                                                    res.status(400).send({ message: "no such bid exsist" });
                                                } else {
                                                    if (user._id.equals(product.userId)) {
                                                        bid.isSpam = 1;
                                                        bid.save(function (err, bid) {

                                                            if (!err) {

                                                                res.status(200).json({ message: "marked as spam!" });
                                                            } else {

                                                                res.status(400).send({ message: "bid was not saved" });
                                                            }
                                                        });
                                                    } else {

                                                        res.status(400).json({ message: "you are not authorized to edit bid" });
                                                    }
                                                }
                                            });
                                        }
                                    } else {

                                        res.status(400).send(err);
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

    //GET BIDS BY DYNAMIC QUERY
    api.get('/dynamic/:token/:query/:sortby/:page', function (req, res) {
        //check token
        _login2.default.findOne({ token: req.params.token }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not Login!' });
            } else {
                var sort = ["lastEdit", "rating"];
                var sortby = "lastEdit";
                if (sort.indexOf(req.params.sortby) > -1) {

                    sortby = req.params.sortby;
                }
                //checking if page number is correct
                var pageNumber = 1;

                if (!isNaN(req.params.page)) {
                    pageNumber = req.params.page;
                }
                //async query start here

                var qry = JSON.parse(decodeURIComponent(req.params.query));
                var countQuery = function countQuery(callback) {
                    _bid2.default.find(qry, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc.length);
                        }
                    });
                };

                var retrieveQuery = function retrieveQuery(callback) {
                    _bid2.default.find(qry).skip((pageNumber - 1) * 12).sort(_defineProperty({}, sortby, -1)).limit(12).exec(function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc);
                        }
                    });
                };

                _async2.default.parallel([countQuery, retrieveQuery], function (err, results) {
                    if (err) {
                        // console.log("error here");
                        res.status(500).send(err);
                    } else {
                        res.status(200).json({ total_pages: Math.floor(results[0] / 12 + 1), page: pageNumber, bids: results[1] });
                    }
                });
            }
        });
    });
    return api;
};
//# sourceMappingURL=bid.js.map