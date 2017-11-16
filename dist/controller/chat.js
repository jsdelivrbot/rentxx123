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

var _chat = require('../model/chat');

var _chat2 = _interopRequireDefault(_chat);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _notification = require('../model/notification');

var _notification2 = _interopRequireDefault(_notification);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    //adding a category
    //v1/chat/add
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

                            if (login.token == req.body.token) {
                                //token matching and only admin can add
                                var newChat = new _chat2.default();
                                newChat.from = user._id;
                                newChat.towards = req.body.towards;

                                newChat.chatId = parseInt(user._id, 16) > parseInt(req.body.towards, 16) ? user._id + req.body.towards : req.body.towards + user._id;
                                newChat.message = req.body.message;
                                newChat.save(function (err) {

                                    if (!err) {
                                        _notification2.default.findOne({

                                            $and: [{ userId: req.body.towards }, { $or: [{ saw: 1 }, { saw: 0 }] }] }, function (err, notification) {

                                            if (!err) {

                                                if (notification == null) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = req.body.towards;
                                                    newNotification.message = "You have a message!";
                                                    newNotification.description = "Message recieved from " + user.fname;
                                                    newNotification.type = 1;
                                                    newNotification.refId = user._id;
                                                    newNotification.link = "/chat";
                                                    newNotification.save();
                                                    _user2.default.findById(req.body.towards, function (err, ownerUser) {

                                                        if (!err) {

                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/chat.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Message Recieved!', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Message Recieved!", name: ownerUser.fname, message: req.body.message, byperson: user.fname }, function (err) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                    }
                                                                })

                                                            };
                                                            transporter.sendMail(mailOptions, function (err, info) {
                                                                if (err) console.log(err);else console.log(info);
                                                            });
                                                            //sending mail ends
                                                        }
                                                    });
                                                } else {
                                                    console.log(notification);
                                                    notification.saw = 0;
                                                    notification.time = Date.now();
                                                    notification.save();
                                                }
                                            }
                                        });

                                        res.status(200).send({ message: "chat added!" });
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
    //v1/chat/get
    api.post('/get/:userId', function (req, res) {
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

                            if (login.token == req.body.token) {
                                //token matching and only admin can add

                                var chatId = parseInt(user._id, 16) > parseInt(req.params.userId, 16) ? user._id + req.params.userId : req.params.userId + user._id;

                                _chat2.default.find({ chatId: chatId }, function (err, chat) {
                                    if (!err) {
                                        if (chat === undefined) {

                                            res.status(400).json({ message: "no chat found!" });
                                        } else {

                                            res.status(200).json(chat);
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
//# sourceMappingURL=chat.js.map