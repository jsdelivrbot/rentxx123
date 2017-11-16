'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _express = require('express');

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _product = require('../model/product');

var _product2 = _interopRequireDefault(_product);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _college = require('../model/college');

var _college2 = _interopRequireDefault(_college);

var _category = require('../model/category');

var _category2 = _interopRequireDefault(_category);

var _notification = require('../model/notification');

var _notification2 = _interopRequireDefault(_notification);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/v1/product/add/emailID'
    api.post('/add/:email', function (req, res) {
        //check token

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

                            if (login.token == req.body.token) {
                                //token matching

                                var newProduct = new _product2.default();
                                newProduct.productName = req.body.productName;
                                // newproduct.image=req.body.name; saved for later
                                newProduct.productAge = req.body.paroductAge;
                                newProduct.ProductDescription = req.body.description;
                                newProduct.referenceLink = req.body.referenceLink;
                                newProduct.college = user.college;
                                newProduct.city = user.city;
                                newProduct.userId = user._id, newProduct.rentPerAmount = req.body.rentPerAmount, newProduct.condition = req.body.condition, newProduct.rentTimeType = req.body.rentTimeType, newProduct.isSecurityAmount = req.body.isSecurityAmount, newProduct.securityAmount = req.body.securityAmount, newProduct.editTime = Date();
                                newProduct.save(function (err, product) {

                                    if (!err) {
                                        var newNotification = new _notification2.default();
                                        newNotification.userId = user._id;
                                        newNotification.message = "Status Pending!";
                                        newNotification.description = "You product " + product.productName + " is peding on approval by moderators will get back to you soon!";
                                        newNotification.type = 1;
                                        newNotification.refId = user._id;
                                        newNotification.link = "/product";
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
                                            subject: 'Product Saved', // Subject line
                                            html: _ejs2.default.render(templateString, { heading: "pending approval", name: user.fname, message: "Your Product is upload and pending approval!", productName: req.body.productName }, function (err) {
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
                                        res.status(200).json(product);
                                    } else {

                                        res.status(400).json({ message: "product not saved!" });
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

    //updating a product

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
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {
                                            console.log(user._id);
                                            console.log(product.userId);
                                            if (user._id.equals(product.userId) || login.userType > 0) {
                                                //here user who created the product can make changes and the admin
                                                product.productName = req.body.productName;
                                                product.productDescription = req.body.description;
                                                product.referenceLink = req.body.referenceLink;
                                                product.condition = req.body.condition;
                                                product.rentPerAmount = req.body.rentPerAmount;
                                                product.rentTimeType = req.body.rentTimeType;
                                                product.isSecurityAmount = req.body.isSecurityAmount;
                                                product.securityAmount = req.body.securityAmount;
                                                product.productAge = req.body.productAge;
                                                product.editTime = Date();
                                                product.imageApproved = 0;
                                                product.linkApproved = 0;
                                                product.productApproved = 0;
                                                product.facebookLink = req.body.facebooklink;
                                                product.youtubeLink = req.body.youtubelink;
                                                product.twitterLink = req.body.twitterlink;
                                                product.save(function (err, product) {

                                                    if (!err) {

                                                        res.status(200).send(product);
                                                    } else {

                                                        res.status(400).send({ message: "product was not saved" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to update product" });
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
    //deleting a product
    api.delete('/delete/:id', function (req, res) {
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

                            if (login.token === req.body.token) {
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {
                                            console.log(user._id);
                                            console.log(product.userId);
                                            if (user._id.equals(product.userId) || login.userType > 0) {

                                                product.remove(function (err) {

                                                    if (!err) {

                                                        res.status(200).send({ message: "product deleted successsfully!" });
                                                    } else {

                                                        res.status(400).send({ message: "product was not saved" });
                                                    }
                                                });
                                            } else {

                                                res.status(400).send({ message: "not authorized to delete product" });
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

    //adding a view
    api.put('/addview/:id', function (req, res) {
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

                            if (login.token === req.body.token) {
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.pageView = product.pageView + 1;
                                            product.save(function (err) {

                                                if (!err) {

                                                    res.status(200).send({ message: "increased page view" });
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
    //adding to wishlist
    api.put('/addwishlist/:id', function (req, res) {
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

                            if (login.token === req.body.token) {
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {
                                            var a = -1;
                                            if (product.wishList === undefined) {
                                                product.wishList = user.email + ",";
                                            } else {
                                                a = product.wishList.search(user.email + ",");
                                            }
                                            if (a < 0) {
                                                product.wishList = product.wishList + user.email + ",";
                                                product.save(function (err) {

                                                    if (!err) {

                                                        res.status(200).send({ message: "added to wishlist " });
                                                    } else {

                                                        res.status(400).send({ message: "some problem occured" });
                                                    }
                                                });
                                            } else {

                                                res.status(200).send({ message: "added to wishlist " });
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
    //removing from wishlist
    api.put('/removewishlist/:id', function (req, res) {
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

                            if (login.token === req.body.token) {
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {
                                            var a = -1;
                                            if (product.wishList === undefined) {
                                                res.status(400).send({ message: "wishlist is empty!" });
                                            } else {
                                                a = product.wishList.search(user.email + ",");
                                            }
                                            if (a >= 0) {
                                                product.wishList = product.wishList.replace(user.email + ",", "");
                                                product.save(function (err) {

                                                    if (!err) {

                                                        res.status(200).send({ message: "removed from wishlist " });
                                                    } else {

                                                        res.status(400).send({ message: "some problem occured" });
                                                    }
                                                });
                                            } else {

                                                res.status(200).send({ message: "removed from wishlist " });
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

    //adding review
    api.put('/addreview/:id', function (req, res) {
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

                            if (login.token === req.body.token) {
                                //token matching
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            _review2.default.findOne({ userId: user._id, productId: req.params.id }, function (err, review) {

                                                if (!err) {

                                                    if (review === null) {
                                                        if (req.body.value > 5 || req.body.value < .5) {

                                                            res.status(400).send({ message: "value of the rating should be between 0.5 and 5" });
                                                        } else {
                                                            var newReview = new _review2.default();
                                                            newReview.userId = user._id;
                                                            newReview.productId = req.params.id;
                                                            newReview.value = req.body.value;
                                                            newReview.description = req.body.description;
                                                            product.ratings = (product.numberOfRatings * product.ratings + req.body.value) / (product.numberOfRatings + 1);
                                                            product.numberOfRatings = product.numberOfRatings + 1;
                                                            newReview.save(function (err) {

                                                                if (!err) {

                                                                    product.save(function (err) {

                                                                        if (err) {

                                                                            res.status(500).send(err);
                                                                        }
                                                                        res.status(200).send({ message: "review has been saved!" });
                                                                    });
                                                                } else {

                                                                    res.status(500).send(err);
                                                                }
                                                            });
                                                        }
                                                    } else {

                                                        if (req.body.value > 5 || req.body.value < .5) {

                                                            res.status(400).send({ message: "value of the rating should be between 0.5 and 5" });
                                                        } else {
                                                            if (product.numberOfRatings === 1) {
                                                                product.ratings = req.body.value;
                                                            } else {
                                                                product.ratings = (product.numberOfRatings * product.ratings - review.value) / (product.numberOfRatings - 1);
                                                                product.ratings = ((product.numberOfRatings - 1) * product.ratings + req.body.value) / product.numberOfRatings;
                                                            }
                                                            review.value = req.body.value;
                                                            review.description = req.body.description;
                                                            review.save(function (err) {

                                                                if (!err) {

                                                                    product.save(function (err) {

                                                                        if (err) {

                                                                            res.status(500).send(err);
                                                                        }
                                                                        res.status(200).send({ message: "review has been saved!" });
                                                                    });
                                                                } else {

                                                                    res.status(500).send(err);
                                                                }
                                                            });
                                                        }
                                                    }
                                                } else {

                                                    res.status(500).send(err);
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

    //approvals starts here!
    //approving product
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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.productApproved = 1;
                                            product.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = product.userId;
                                                    newNotification.message = "Product Approved!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = product._id;
                                                    newNotification.link = "/product";
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
                                                            var templateString = _fs2.default.readFileSync('views/approvals.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Accepted", name: ownerUser.fname, message: "Your Product is Approved!", productName: product.productName }, function (err) {
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
                                                    res.status(200).send({ message: "product approved!" });
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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.linkApproved = 1;
                                            product.save(function (err) {

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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.imageApproved = 1;
                                            product.save(function (err) {

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
    //rejecting product
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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.productApproved = 2;
                                            product.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = product.userId;
                                                    newNotification.message = "Product Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = product._id;
                                                    newNotification.link = "/product";
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
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your Product is Rejected!", productName: product.productName, reason: req.body.description }, function (err) {
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
                                                    res.status(200).send({ message: "product rejected!" });
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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.linkApproved = 2;
                                            product.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = product.userId;
                                                    newNotification.message = "Link Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = product._id;
                                                    newNotification.link = "/product";
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
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your Link is Rejected!", productName: product.productName, reason: req.body.description }, function (err) {
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
                                                    res.status(200).send({ message: "link  rejected!" });
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
                                _product2.default.findOne({ _id: req.params.id }, function (err, product) {

                                    if (!err) {
                                        if (product === undefined) {

                                            res.status(400).send({ message: "no such product exsist" });
                                        } else {

                                            product.imageApproved = 2;
                                            product.save(function (err) {

                                                if (!err) {
                                                    var newNotification = new _notification2.default();
                                                    newNotification.userId = product.userId;
                                                    newNotification.message = "Images Rejected!";
                                                    newNotification.description = req.body.description;
                                                    newNotification.type = 1;
                                                    newNotification.refId = product._id;
                                                    newNotification.link = "/product";
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
                                                            var templateString = _fs2.default.readFileSync('views/rejected.ejs', 'utf-8');
                                                            var mailOptions = {
                                                                from: 'toshikverma@gmail.com', // sender address
                                                                to: ownerUser.email, // list of receivers
                                                                subject: 'Approvals', // Subject line
                                                                html: _ejs2.default.render(templateString, { heading: "Rejected", name: ownerUser.fname, message: "Your Images is Rejected!", productName: product.productName, reason: req.body.description }, function (err) {
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
    //GET PRODUCTS BY COLLEGE
    api.get('/productsbycollege/:token/:collegeId/:sortby/:page', function (req, res) {
        //check token
        _login2.default.findOne({ token: req.params.token }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not Login!' });
            } else {
                //checking correct college
                _college2.default.findOne({ email: req.params.collegeId }, function (err, user) {
                    //checking correct sort if wrong sort by date
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
                    console.log("query started");
                    var countQuery = function countQuery(callback) {
                        _product2.default.find({ college: req.params.collegeId }, function (err, doc) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, doc.length);
                            }
                        });
                    };

                    var retrieveQuery = function retrieveQuery(callback) {
                        console.log((pageNumber - 1) * 12);
                        _product2.default.find({ college: req.params.collegeId }).skip((pageNumber - 1) * 12).sort({ sortby: -1 }).limit(12).exec(function (err, doc) {
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
                });
            }
        });
    });
    //GET PRODUCTS BY CATEGORY
    api.get('/productsbycategory/:token/:category/:sortby/:page', function (req, res) {
        //check token
        _login2.default.findOne({ token: req.params.token }, function (err, user) {
            if (user == undefined) {
                res.status(400).json({ message: 'User not Login!' });
            } else {
                //checking correct category
                _category2.default.findOne({ _id: req.params.category }, function (err, user) {
                    //checking correct sort if wrong sort by date
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
                    console.log("query started");
                    var countQuery = function countQuery(callback) {
                        _product2.default.find({ category: req.params.category }, function (err, doc) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, doc.length);
                            }
                        });
                    };

                    var retrieveQuery = function retrieveQuery(callback) {
                        console.log((pageNumber - 1) * 12);
                        _product2.default.find({ category: req.params.category }).skip((pageNumber - 1) * 12).sort({ sortby: -1 }).limit(12).exec(function (err, doc) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, doc);
                            }
                        });
                    };

                    console.log(retrieveQuery);
                    _async2.default.parallel([countQuery, retrieveQuery], function (err, results) {
                        if (err) {
                            // console.log("error here");
                            res.status(500).send(err);
                        } else {
                            res.status(200).json({ total_pages: Math.floor(results[0] / 12 + 1), page: pageNumber, products: results[1] });
                        }
                    });
                });
            }
        });
    });
    //GET PRODUCTS BY DYNAMIC QUERY
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
                    _product2.default.find(qry, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc.length);
                        }
                    });
                };

                var retrieveQuery = function retrieveQuery(callback) {
                    _product2.default.find(qry).skip((pageNumber - 1) * 12).sort({ sortby: -1 }).limit(12).exec(function (err, doc) {
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

    //GET PRODUCTS BY SEARCH QUERY
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
                    _product2.default.find({ productName: new RegExp(req.params.search, "i") }, function (err, doc) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, doc.length);
                        }
                    });
                };

                var retrieveQuery = function retrieveQuery(callback) {
                    _product2.default.find({ productName: new RegExp(req.params.search, "i") }).skip((pageNumber - 1) * 12).limit(12).exec(function (err, doc) {
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
    return api;
};
//# sourceMappingURL=product.js.map