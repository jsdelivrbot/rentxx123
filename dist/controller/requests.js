'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _requests = require('../model/requests');

var _requests2 = _interopRequireDefault(_requests);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _notification = require('../model/notification');

var _notification2 = _interopRequireDefault(_notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/v1/requests/add/emailID'
    api.post('/add', function (req, res) {
        //check token
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
                                //password matching

                                var newRequest = new _requests2.default();
                                newRequest.requestName = req.body.requestName;
                                // newRequest.image=req.body.name; saved for later
                                newRequest.fromDate = req.body.fromDate;
                                newRequest.toDate = req.body.toDate;
                                newRequest.image1 = req.body.image1;
                                newRequest.image2 = req.body.image2;
                                newRequest.image3 = req.body.image3;
                                newRequest.image4 = req.body.image4;
                                newRequest.description = req.body.description;
                                newRequest.referenceLink = req.body.referenceLink;
                                newRequest.college = user.college;
                                newRequest.city = user.city;
                                newRequest.userId = user._id;
                                newRequest.userName = req.body.userName;
                                newRequest.lastEdit = Date();
                                newRequest.save(function (err, request) {

                                    if (!err) {
                                        var newNotification = new _notification2.default();
                                        newNotification.userId = user._id;
                                        newNotification.message = "Status Pending!";
                                        newNotification.description = "You Request " + request.requestName + " is peding on approval by moderators will get back to you soon!";
                                        newNotification.type = 4;
                                        newNotification.refId = request._id;
                                        newNotification.link = "/requests";
                                        //sending mail 
                                        var transporter = _nodemailer2.default.createTransport({
                                            service: 'Gmail',
                                            auth: {
                                                user: 'toshikverma1@gmail.com', // Your email id
                                                pass: '123123123a' // Your password
                                            }
                                        });
                                        var templateString = _fs2.default.readFileSync('views/approvals.ejs', 'utf-8');
                                        var mailOptions = {
                                            from: 'toshikverma@gmail.com', // sender address
                                            to: user.email, // list of receivers
                                            subject: 'Request Saved', // Subject line
                                            html: _ejs2.default.render(templateString, { heading: "Pending approval", name: user.fname, message: "Your Request is upload and pending approval!", productName: req.body.requestName }, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            })

                                        };
                                        transporter.sendMail(mailOptions, function (err, info) {
                                            if (err) console.log(err);else console.log(info);
                                        });
                                        //sending mail ends
                                        newNotification.save();
                                        res.status(200).json(request);
                                    } else {

                                        res.status(400).json({ message: "request not saved!" });
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

    //updating a request

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

                            if (login.token == req.body.token) {
                                //password matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {
                                            console.log(user._id);
                                            console.log(request.userId);
                                            if (user._id.equals(request.userId) || login.userType > 0) {
                                                request.requestName = req.body.requestName;
                                                request.numberOfDays = req.body.numberOfDays;
                                                request.description = req.body.description;
                                                request.referenceLink = req.body.referenceLink;
                                                request.image1 = req.body.image1;
                                                request.image2 = req.body.image2;
                                                request.image3 = req.body.image3;
                                                request.image4 = req.body.image4;
                                                request.fromDate = req.body.fromDate;
                                                request.toDate = req.body.toDate;
                                                request.lastEdit = Date();
                                                request.save(function (err, request) {

                                                    if (!err) {

                                                        res.status(200).send(request);
                                                    } else {

                                                        res.status(400).send({ message: "request was not saved" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to update request" });
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
    //deleting a request
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

                            if (login.token == req.params.token) {
                                //password matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {
                                            console.log(user._id);
                                            console.log(request.userId);
                                            if (user._id.equals(request.userId) || login.userType > 0) {

                                                request.remove(function (err) {

                                                    if (!err) {

                                                        res.status(200).send({ message: "request deleted successsfully!" });
                                                    } else {

                                                        res.status(400).send({ message: "request was not saved" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to delete request" });
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
    //------------------------------------------------------------------------
    //aaproval starts here!
    //approving request
    api.put('/approveproduct/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.requestApproved = 1;
                                            request.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = request.userId;
                                                    newNotification.message = "Request Approved!";
                                                    newNotification.description = "Your Request " + request.requestName + " has been approved";
                                                    newNotification.type = 4;
                                                    newNotification.refId = request._id;
                                                    newNotification.link = "/requests";
                                                    newNotification.save();
                                                    _user2.default.findById(request.userId, function (err, ownerUser) {

                                                        if (!err) {
                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/approvals.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Accepted", name: ownerUser.fname, message: "Your Request is Approved!", productName: request.requestName }, function (err) {
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
                                                    res.status(200).send({ message: "request approved!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //approving link
    api.put('/approvelink/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.linkApproved = 1;
                                            request.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "link  approved!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //approving  iamges
    api.put('/approveimages/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.imageApproved = 1;
                                            request.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "image approved!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //rejecting request
    api.put('/rejectproduct/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.requestApproved = 2;
                                            request.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = request.userId;
                                                    newNotification.message = "request Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = request._id;
                                                    newNotification.link = "/requests";
                                                    _user2.default.findById(request.userId, function (err, ownerUser) {

                                                        if (!err) {
                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your Request is Rejected!", productName: request.requestName, reason: req.body.description }, function (err) {
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
                                                    newNotification.save();
                                                    res.status(200).send({ message: "Request rejected!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //approving link
    api.put('/rejectlink/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.linkApproved = 0;
                                            request.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = request.userId;
                                                    newNotification.message = "Link Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = request._id;
                                                    newNotification.link = "/requests";
                                                    _user2.default.findById(request.userId, function (err, ownerUser) {

                                                        if (!err) {
                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your Link is rejected!", productName: request.requestName, reason: req.body.description }, function (err) {
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
                                                    newNotification.save();
                                                    res.status(200).send({ message: "Link  rejected!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //approving  iamges
    api.put('/rejectimages/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.imageApproved = 0;
                                            request.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = request.userId;
                                                    newNotification.message = "Images Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = request._id;
                                                    newNotification.link = "/requests";
                                                    _user2.default.findById(request.userId, function (err, ownerUser) {

                                                        if (!err) {
                                                            //sending mail 
                                                            var transporter = _nodemailer2.default.createTransport({
                                                                service: 'Gmail',
                                                                auth: {
                                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                                    pass: '123123123a' // Your password
                                                                }
                                                            });
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your image/images is/are Rejected", productName: request.requestName, reason: req.body.description }, function (err) {
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
                                                    newNotification.save();
                                                    res.status(200).send({ message: "image reject!" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    //GET REQUESTS BY DYNAMIC QUERY
    api.get('/dynamic/:token/:query/:sortby/:page', function (req, res) {
        //check token
        _login2.default.findOne({ token: req.params.token }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not Login!' });
            } else {

                var sort = ["date", "rating"];
                var sortby = "date";
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
                    _requests2.default.find(qry, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc.length);
                        }
                    });
                };

                var retrieveQuery = function retrieveQuery(callback) {

                    _requests2.default.find(qry).skip((pageNumber - 1) * 12).sort({ sortby: -1 }).limit(12).exec(function (err, doc) {
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
                        res.status(200).json({ total_pages: Math.floor(results[0] / 12 + 1), page: pageNumber, requests: results[1] });
                    }
                });
            }
        });
    });
    //GET Requests BY SEARCH QUERY
    api.get('/search/:token/:search/:page', function (req, res) {
        //check token
        _login2.default.findOne({ token: req.params.token }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not Login!' });
            } else {

                //checking if page number is correct
                var pageNumber = 1;

                if (!isNaN(req.params.page)) {
                    pageNumber = req.params.page;
                }
                //async query start here
                var countQuery = function countQuery(callback) {
                    _requests2.default.find({ requestName: new RegExp(req.params.search, "i") }, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc.length);
                        }
                    });
                };

                var retrieveQuery = function retrieveQuery(callback) {
                    _requests2.default.find({ requestName: new RegExp(req.params.search, "i") }).skip((pageNumber - 1) * 12).limit(12).exec(function (err, doc) {
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
                        res.status(200).json({ total_pages: Math.floor(results[0] / 12 + 1), page: pageNumber, products: results[1] });
                    }
                });
            }
        });
    });
    //assigning category
    api.put('/assigncategory/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            request.category = req.body.category;
                                            request.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "category updated" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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

    //assigning subcategory
    api.put('/assignsubcategory/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, request) {

                                    if (!err) {
                                        if (request === undefined) {

                                            res.status(400).send({ message: "no such request exsist" });
                                        } else {

                                            request.subCategory = req.body.subcategory;
                                            request.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "subcategory updated" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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

    api.put('/togglehold/:id', function (req, res) {
        //check token
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
                                //token matching
                                _requests2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            if (product.onHold == 0) {
                                                product.onHold = 1;
                                            } else {
                                                product.onHold = 0;
                                            }
                                            product.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "Hold toggeled" });
                                                } else {

                                                    res.status(400).send({ message: "some problem occured" });
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
    return api;
};
//# sourceMappingURL=requests.js.map