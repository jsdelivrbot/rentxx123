'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _login = require('../model/login');

var _login2 = _interopRequireDefault(_login);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // '/v1/user/add'
  api.post('/add', function (req, res) {
    console.log("hello " + req.body.fname);
    var newUser = new _user2.default();
    newUser.fname = req.body.fname;
    newUser.lname = req.body.lname;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.college = req.body.college;
    newUser.city = req.body.city;
    newUser.save(function (err, user) {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          return res.status(500).send({ succes: false, message: 'User already exist!' });
        }

        // Some other error
        return res.status(500).send(err);
      }
      //sending mail 
      var transporter = _nodemailer2.default.createTransport({
        service: 'Gmail',
        auth: {
          user: 'toshikverma1@gmail.com', // Your email id
          pass: '123123123a' // Your password
        }
      });
      var templateString = _fs2.default.readFileSync('views/verify.ejs', 'utf-8');
      var vaerificationAddress = config.myurl + "user/verify/" + user.emailverificationkey + "/" + user.email;
      console.log(_path2.default.join(__dirname, '/views/welcome.ejs'));
      var mailOptions = {
        from: 'toshikverma@gmail.com', // sender address
        to: user.email, // list of receivers
        subject: 'Verification Email', // Subject line
        html: _ejs2.default.render(templateString, { heading: "Verification Email", name: user.fname, link: vaerificationAddress }, function (err) {
          if (err) {
            console.log(err);
          }
        })
        // html: ejs.renderFile(path.join(__dirname,'/views/welcome.ejs'),{heading:"Verification Email",body:"test body"}) //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err);else console.log(info);
      });
      //sending mail ends
      res.json({ message: 'User saved successfully' });
    });
  });

  //updating user
  api.put('/update/:email', function (req, res) {
    _user2.default.findOne({ email: req.params.email }, function (err, user) {
      if (!err) {
        if (user === null) {
          res.json({ message: 'User not found!' });
        } else {
          user.fname = req.body.fname;
          user.lname = req.body.lname;
          user.save(function (err, user) {
            if (err) {

              res.send(err);
            }
            res.json({ message: 'User updated successfully' });
          });
        }
      } else {

        res.send(err);
      }
    });
  });
  //deleting a user
  api.delete('/delete/:id', function (req, res) {
    //check password or match password
    _user2.default.findById(req.params.id, function (err, user) {
      if (user == undefined) {
        res.status(400).json({ message: 'User not found!' });
      } else {
        _login2.default.findOne({ email: req.body.email }, function (err, login) {

          if (!err) {

            if (login == undefined) {
              //user not found

              res.status(400).json({ message: 'User not Logged In!' });
            } else {

              if (login.token == req.body.token && login.userType == 3) {
                //token matching

                user.remove(function (err) {

                  if (err) {
                    res.status(500).send(err);
                  } else {

                    res.status(200).json({ message: "user removed!" });
                  }
                });
              } else {

                res.status(400).send({ message: "you are not authorized for moderation!" });
              }
            }
          } else {

            res.status(500).send(err);
          }
        });
      }
    });
  });
  //promoting as moderator
  api.put('/promote/:id', function (req, res) {
    //check password or match password
    _user2.default.findById(req.params.id, function (err, user) {
      if (user == undefined) {
        res.status(400).json({ message: 'User not found!' });
      } else {
        _login2.default.findOne({ email: req.body.email }, function (err, login) {

          if (!err) {

            if (login == undefined) {
              //user not found

              res.status(400).json({ message: 'User not Logged In!' });
            } else {

              if (login.token == req.body.token && login.userType == 3) {
                //token matching
                user.userType = 2;
                user.save(function (err) {

                  if (err) {
                    res.status(500).send(err);
                  } else {

                    res.status(200).json({ message: "upgraded!" });
                  }
                });
              } else {

                res.status(400).send({ message: "you are not authorized for moderation!" });
              }
            }
          } else {

            res.status(500).send(err);
          }
        });
      }
    });
  });
  //demoting as moderator
  api.put('/demote/:id', function (req, res) {
    //check password or match password
    _user2.default.findById(req.params.id, function (err, user) {
      if (user == undefined) {
        res.status(400).json({ message: 'User not found!' });
      } else {
        _login2.default.findOne({ email: req.body.email }, function (err, login) {

          if (!err) {

            if (login == undefined) {
              //user not found

              res.status(400).json({ message: 'User not Logged In!' });
            } else {

              if (login.token == req.body.token && login.userType == 3) {
                //token matching
                user.userType = 0;
                user.save(function (err) {

                  if (err) {
                    res.status(500).send(err);
                  } else {

                    res.status(200).json({ message: "demoted!" });
                  }
                });
              } else {

                res.status(400).send({ message: "you are not authorized for moderation!" });
              }
            }
          } else {

            res.status(500).send(err);
          }
        });
      }
    });
  });
  //updating user
  api.get('/verify/:key/:email', function (req, res) {
    _user2.default.findOne({ email: req.params.email }, function (err, user) {
      if (!err) {
        if (user === null) {
          res.status(400).json({ message: 'User not found!' });
        } else {
          if (user.emailverificationkey === req.params.key) {
            user.emailverified = 1;
            user.save(function (err) {
              if (!err) {
                //sending mail 
                var transporter = _nodemailer2.default.createTransport({
                  service: 'Gmail',
                  auth: {
                    user: 'toshikverma1@gmail.com', // Your email id
                    pass: '123123123a' // Your password
                  }
                });
                var templateString = _fs2.default.readFileSync('views/welcome.ejs', 'utf-8');
                var mailOptions = {
                  from: 'toshikverma@gmail.com', // sender address
                  to: user.email, // list of receivers
                  subject: 'Email Verified!', // Subject line
                  html: _ejs2.default.render(templateString, { heading: "Welcome Email verified!", name: user.fname }, function (err) {
                    if (err) {
                      console.log(err);
                    }
                  })
                  // html: ejs.renderFile(path.join(__dirname,'/views/welcome.ejs'),{heading:"Verification Email",body:"test body"}) //, // plaintext body
                  // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
                };
                transporter.sendMail(mailOptions, function (err, info) {
                  if (err) console.log(err);else console.log(info);
                });
                //sending mail ends
                res.status(200).json({ message: "user verified!" });
              } else {

                res.status(500).send(err);
              }
            });
          } else {
            res.status(400).json({ message: 'invalid verification key' });
          }
        }
      } else {

        res.send(err);
      }
    });
  });
  return api;
};
//# sourceMappingURL=user.js.map