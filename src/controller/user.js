import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import async from 'async';
import { Router } from 'express';
import User from '../model/user';
import Login from '../model/login';
import bodyParser from 'body-parser';

export default({ config, db }) => {
  let api = Router();

  // '/v1/user/add'
  api.post('/add', (req, res) => {
    console.log("hello "+req.body.fname);
    let newUser = new User();
    newUser.fname = req.body.fname;
    newUser.lname = req.body.lname;
    newUser.email = req.body.email;
    newUser.password=req.body.password;
    newUser.college=req.body.college;
    newUser.city=req.body.city;
    newUser.save(function(err,user) {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          return res.status(500).send({ succes: false, message: 'User already exist!' });
        }
  
        // Some other error
        return res.status(500).send(err);
      }
      //sending mail 
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'toshikverma1@gmail.com', // Your email id
    pass: '123123123a' // Your password
  }
});
var templateString = fs.readFileSync('views/verify.ejs', 'utf-8');
let vaerificationAddress=config.myurl+"user/verify/"+user.emailverificationkey+"/"+user.email
console.log(path.join(__dirname,'/views/welcome.ejs'));
var mailOptions = {
  from: 'toshikverma@gmail.com', // sender address
  to: user.email, // list of receivers
  subject: 'Verification Email', // Subject line
  html: ejs.render(templateString,{heading:"Verification Email",name:user.fname,link:vaerificationAddress},(err)=>{
    if(err){
      console.log(err);
    }
  }) 
  // html: ejs.renderFile(path.join(__dirname,'/views/welcome.ejs'),{heading:"Verification Email",body:"test body"}) //, // plaintext body
  // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
   
  else
    console.log(info);
});
//sending mail ends
      res.json({ message: 'User saved successfully' });
    });
  });
  
       //updating user
       api.put('/update/:email',(req,res)=>{
        User.findOne({email: req.params.email}, function(err, user) {
          if(!err) {
            if(user===null){
              res.json({ message: 'User not found!' });
  
            }else{
              user.fname=req.body.fname;
              user.lname=req.body.lname;
              user.save(function(err,user) {
                  if(err){

                    res.send(err);
                  }
                  res.json({ message: 'User updated successfully' });
                  
              });
            }
          }else{

            res.send(err);
          }
      });
    });
    //deleting a user
   api.delete('/delete/:id',(req,res)=>{
    //check password or match password
    User.findById((req.params.id),(err,user)=>{
      if(user==undefined){
       res.status(400).json({ message: 'User not found!' });
   }else{
Login.findOne({email:req.body.email},(err,login)=>{

   if(!err){

       if(login==undefined){ //user not found

           res.status(400).json({ message: 'User not Logged In!' });
       }else{

           if(login.token==req.body.token && login.userType==3){  //token matching
           
            user.remove((err)=>{

              if(err){
                res.status(500).send(err);
              }else{


                res.status(200).json({message:"user removed!"});
              }
            });
           }else{

            res.status(400).send({message:"you are not authorized for moderation!"});
           }
          }
        }else{

          res.status(500).send(err);
        }
          });
        }
  });
});
    //promoting as moderator
    api.put('/promote/:id',(req,res)=>{
      //check password or match password
      User.findById((req.params.id),(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token && login.userType==3){  //token matching
              user.userType=2;
              user.save((err,changed)=>{

                if(err){
                  res.status(500).send(err);
                }else{


                  res.status(200).json(changed);
                }
              });
             }else{

              res.status(400).send({message:"you are not authorized for moderation!"});
             }
            }
          }else{

            res.status(500).send(err);
          }
            });
          }
    });
  });
   //demoting as moderator
   api.put('/demote/:id',(req,res)=>{
    //check password or match password
    User.findById((req.params.id),(err,user)=>{
      if(user==undefined){
       res.status(400).json({ message: 'User not found!' });
   }else{
Login.findOne({email:req.body.email},(err,login)=>{

   if(!err){

       if(login==undefined){ //user not found

           res.status(400).json({ message: 'User not Logged In!' });
       }else{

           if(login.token==req.body.token && login.userType==3){  //token matching
            user.userType=0;
            user.save((err,changed)=>{

              if(err){
                res.status(500).send(err);
              }else{


                res.status(200).json(changed);
              }
            });
           }else{

            res.status(400).send({message:"you are not authorized for moderation!"});
           }
          }
        }else{

          res.status(500).send(err);
        }
          });
        }
  });
});
 //updating user
 api.get('/verify/:key/:email',(req,res)=>{
  User.findOne({email: req.params.email}, function(err, user) {
    if(!err) {
      if(user===null){
        res.status(400).json({ message: 'User not found!' });

      }else{
       if(user.emailverificationkey===req.params.key){
          user.emailverified=1;
          user.save((err)=>{
            if(!err){
 //sending mail 
 var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'toshikverma1@gmail.com', // Your email id
      pass: '123123123a' // Your password
  }
});
var templateString = fs.readFileSync('views/welcome.ejs', 'utf-8');
var mailOptions = {
  from: 'toshikverma@gmail.com', // sender address
  to: user.email, // list of receivers
  subject: 'Email Verified!', // Subject line
  html: ejs.render(templateString,{heading:"Welcome Email verified!",name:user.fname},(err)=>{
    if(err){
      console.log(err);
    }
  }) 
  // html: ejs.renderFile(path.join(__dirname,'/views/welcome.ejs'),{heading:"Verification Email",body:"test body"}) //, // plaintext body
  // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)

  else
    console.log(info);
});
//sending mail ends
              res.status(200).json({message:"user verified!"});
            }else{

              res.status(500).send(err);
            }

          });

       }else{
        res.status(400).json({ message: 'invalid verification key' });

       }
      }
    }else{

      res.send(err);
    }
});
});
//we are getting user details
 api.post('/get',(req,res)=>{
      //check password or match password
      User.find({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token && login.userType==3){  //token matching
            let sort=["date","fname"];
                    let sortby="date";
                    if(sort.indexOf(req.params.sortby) > -1){

                        sortby=req.params.sortby;
                    }
                    //checking if page number is correct
                    let pageNumber=1
            
                    if(!isNaN(req.body.page)){
                       pageNumber=req.body.page;
                     }
                     //async query start here
                     console.log("query started");
                     var countQuery = function(callback){
                        User.find({}, function(err, doc){
                              if(err){ callback(err, null) }
                              else{
                                  callback(null, doc.length);
                               }
                        }
                        )};
                
                   var retrieveQuery = function(callback){
                       console.log((pageNumber-1)*12);
                       User.find({}).skip((pageNumber-1)*12).sort({sortby: -1}).limit(12).exec(function(err, doc){
                        if(err){ callback(err, null) }
                        else{
                            callback(null, doc);
                         }
                  });
                       
                  };
                
                console.log(retrieveQuery);
                   async.parallel([countQuery, retrieveQuery], function(err, results){
                        //err contains the array of error of all the functions
                        //results contains an array of all the results
                        //results[0] will contain value of doc.length from countQuery function
                        //results[1] will contain doc of retrieveQuery function
                        //You can send the results as
                       if(err){
                       // console.log("error here");
                        res.status(500).send(err);
                       }else{
                        res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, users: results[1]});
                       }
                   });
             }else{

              res.status(400).send({message:"you are not authorized for moderation!"});
             }
            }
          }else{

            res.status(500).send(err);
          }
            });
          }
    });
  });

  //we are getting user details
 api.post('/search',(req,res)=>{
      //check password or match password
      User.find({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token && login.userType==3){  //token matching
            let sort=["date","fname"];
                    let sortby="date";
                    if(sort.indexOf(req.params.sortby) > -1){

                        sortby=req.params.sortby;
                    }
                    //checking if page number is correct
                    let pageNumber=1
            
                    if(!isNaN(req.body.page)){
                       pageNumber=req.body.page;
                     }
                     //async query start here
                     console.log("query started");
                     var countQuery = function(callback){
                        User.find({'email' : {'$regex' : '/' + req.params.query + '/i'} }, function(err, doc){
                              if(err){ callback(err, null) }
                              else{
                                  callback(null, doc.length);
                               }
                        }
                        )};
                
                   var retrieveQuery = function(callback){
                       console.log((pageNumber-1)*12);
                       User.find({'email' : {'$regex' : '/' + req.params.query + '/i'}}).skip((pageNumber-1)*12).sort({sortby: -1}).limit(12).exec(function(err, doc){
                        if(err){ callback(err, null) }
                        else{
                            callback(null, doc);
                         }
                  });
                       
                  };
                
                console.log(retrieveQuery);
                   async.parallel([countQuery, retrieveQuery], function(err, results){
                        //err contains the array of error of all the functions
                        //results contains an array of all the results
                        //results[0] will contain value of doc.length from countQuery function
                        //results[1] will contain doc of retrieveQuery function
                        //You can send the results as
                       if(err){
                       // console.log("error here");
                        res.status(500).send(err);
                       }else{
                        res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, users: results[1]});
                       }
                   });
             }else{

              res.status(400).send({message:"you are not authorized for moderation!"});
             }
            }
          }else{

            res.status(500).send(err);
          }
            });
          }
    });
  });
  return api;
}
