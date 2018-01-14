import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Requests from '../model/requests';
import User from '../model/user';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import async from 'async';
import Notification from '../model/notification';
export default({ config, db }) => {
  let api = Router();

  // '/v1/requests/add/emailID'
  api.post('/add', (req, res) => {
   //check token
     User.findOne({email:req.body.email},(err,user)=>{
       if(user==undefined){
        res.status(400).json({ message: 'User not found!' });
    }else{
Login.findOne({email:req.body.email},(err,login)=>{

    if(!err){

        if(login==undefined){ //user not found

            res.status(400).json({ message: 'User not Logged In!' });
        }else{

            if(login.token==req.body.token){  //password matching
               
                    let newRequest=new Requests();
                    newRequest.requestName=req.body.requestName;
                   // newRequest.image=req.body.name; saved for later
                    newRequest.fromDate=req.body.fromDate;
                    newRequest.toDate=req.body.toDate;
                    newRequest.image1=req.body.image1;
                    newRequest.image2=req.body.image2;
                    newRequest.image3=req.body.image3;
                    newRequest.image4=req.body.image4;
                    newRequest.description=req.body.description;
                    newRequest.referenceLink=req.body.referenceLink;
                    newRequest.college=user.college;
                    newRequest.city=user.city;
                    newRequest.userId=user._id
                    newRequest.lastEdit=Date();
                    newRequest.save((err,request)=>{

                        if(!err){
                            let newNotification=new Notification();
                            newNotification.userId=user._id;
                            newNotification.message="Status Pending!"
                            newNotification.description="You Request "+request.requestName+" is peding on approval by moderators will get back to you soon!";
                            newNotification.type=4;
                            newNotification.refId=request._id;
                            newNotification.link="/requests";
                             //sending mail 
                             var transporter = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                user: 'toshikverma1@gmail.com', // Your email id
                                pass: '123123123a' // Your password
                                }
                            });
                            var templateString = fs.readFileSync('views/approvals.ejs', 'utf-8');
                            var mailOptions = {
                                from: 'toshikverma@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Request Saved', // Subject line
                                html: ejs.render(templateString,{heading:"Pending approval",name:user.fname,message:"Your Request is upload and pending approval!",productName:req.body.requestName},(err)=>{
                                if(err){
                                    console.log(err);
                                }
                                }) 
                                
                            };
                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                console.log(err)
                                
                                else
                                console.log(info);
                            });
                            //sending mail ends
                            newNotification.save();
                                res.status(200).json(request);

                        }else{

                                res.status(400).json({message:"request not saved!"});
                        }
                    });
                   


            }else{
                res.status(400).json({ message: 'invalid token!' });

            }
      
        }
       
    }else{

            res.status(400).send(err);
        }
  
});
    }
            });
  });

  //updating a request

  api.put('/update/:id', (req, res) => {
    //check password or match password
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //password matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                               console.log(user._id);
                               console.log(request.userId);
                                    if(user._id.equals(request.userId) || login.userType>0){
                                    request.requestName=req.body.requestName;
                                    request.numberOfDays=req.body.numberOfDays;
                                    request.description=req.body.description;
                                    request.referenceLink=req.body.referenceLink;
                                    request.lastEdit=Date();
                                    request.save((err,request)=>{

                                        if(!err){

                                            res.status(200).send(request);
                                        }else{

                                            res.status(400).send({message:"request was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to update request"});
                                     }
                                    }


                        }else{

                            res.status(400).send(err);
                        }

                    
                });
                    
                    
 
 
             }else{
                 res.status(400).json({ message: 'invalid token!' });
 
             }
       
         }
        
     }else{
 
             res.status(400).send(err);
         }
   
 });
     }
             });
   });
 //deleting a request
 api.delete('/delete/:id', (req, res) => {
    //check password or match password
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //password matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                               console.log(user._id);
                               console.log(request.userId);
                                    if(user._id.equals(request.userId) || login.userType>0){
                                
                                    request.remove((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"request deleted successsfully!"});
                                        }else{

                                            res.status(400).send({message:"request was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to delete request"});
                                     }
                                    }


                        }else{

                            res.status(400).send(err);
                        }

                    
                });
                    
                    
 
 
             }else{
                 res.status(400).json({ message: 'invalid token!' });
 
             }
       
         }
        
     }else{
 
             res.status(400).send(err);
         }
   
 });
     }
             });
   });
   //------------------------------------------------------------------------
   //aaproval starts here!
   //approving request
   api.put('/approverequest/:id', (req, res) => {
    //check token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
            if(login.token==req.body.token && user.userType>0){  //token matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                            
                                  
                                request.requestApproved=1;
                                    request.save((err)=>{

                                        if(!err){
                                            let newNotification=new Notification();
                                            newNotification.userId=request.userId;
                                            newNotification.message="Request Approved!"
                                            newNotification.description=req.body.description;
                                            newNotification.type=1;
                                            newNotification.refId=request._id;
                                            newNotification.link="/requests";
                                            newNotification.save();
                                            User.findById((request.userId),(err,ownerUser)=>{
                                                
                                                                                                if(!err){
                                            //sending mail 
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: 'toshikverma1@gmail.com', // Your email id
    pass: '123123123a' // Your password
    }
});
var templateString = fs.readFileSync('views/approvals.ejs', 'utf-8');
var mailOptions = {
    from: 'toshikverma@gmail.com', // sender address
    to: ownerUser.email, // list of receivers
    subject: 'Approvals', // Subject line
    html: ejs.render(templateString,{heading:"Accepted",name:ownerUser.fname,message:"Your Request is Approved!",productName:request.requestName},(err)=>{
    if(err){
        console.log(err);
    }
    }) 
    
};
transporter.sendMail(mailOptions, function (err, info) {
    if(err)
    console.log(err)
    
    else
    console.log(info);
});
//sending mail ends
                                                                                                }});                             
res.status(200).send({message:"request approved!"});
                                        }else{

                                            res.status(400).send({message:"some problem occured"});
                                        }
                                    
                                    });

                              
                                    }


                        }else{

                            res.status(400).send(err);
                        }

                    
                });
                    
                    
 
 
             }else{
                 res.status(400).json({ message: 'invalid token!' });
 
             }
       
         }
        
     }else{
 
             res.status(400).send(err);
         }
   
 });
     }
             });
   });
    //approving link
    api.put('/approvelink/:id', (req, res) => {
        //check token
          User.findOne({email:req.body.email},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not found!' });
         }else{
     Login.findOne({email:req.body.email},(err,login)=>{
     
         if(!err){
     
             if(login==undefined){ //user not found
     
                 res.status(400).json({ message: 'User not Logged In!' });
             }else{
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.linkApproved=1;
                                        request.save((err)=>{
    
                                            if(!err){
    
                                                res.status(200).send({message:"link  approved!"});
                                            }else{
    
                                                res.status(400).send({message:"some problem occured"});
                                            }
                                        
                                        });
    
                                  
                                        }
    
    
                            }else{
    
                                res.status(400).send(err);
                            }
    
                        
                    });
                        
                        
     
     
                 }else{
                     res.status(400).json({ message: 'invalid token!' });
     
                 }
           
             }
            
         }else{
     
                 res.status(400).send(err);
             }
       
     });
         }
                 });
       });
       //approving  iamges
    api.put('/approveimages/:id', (req, res) => {
        //check token
          User.findOne({email:req.body.email},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not found!' });
         }else{
     Login.findOne({email:req.body.email},(err,login)=>{
     
         if(!err){
     
             if(login==undefined){ //user not found
     
                 res.status(400).json({ message: 'User not Logged In!' });
             }else{
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.imageApproved=1;
                                        request.save((err)=>{
    
                                            if(!err){
    
                                                res.status(200).send({message:"image approved!"});
                                            }else{
    
                                                res.status(400).send({message:"some problem occured"});
                                            }
                                        
                                        });
    
                                  
                                        }
    
    
                            }else{
    
                                res.status(400).send(err);
                            }
    
                        
                    });
                        
                        
     
     
                 }else{
                     res.status(400).json({ message: 'invalid token!' });
     
                 }
           
             }
            
         }else{
     
                 res.status(400).send(err);
             }
       
     });
         }
                 });
       });
        //rejecting request
   api.put('/rejectrequest/:id', (req, res) => {
    //check token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
            if(login.token==req.body.token && user.userType>0){  //token matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                            
                                  
                                request.requestApproved=2;
                                    request.save((err)=>{

                                        if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="request Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
                                                User.findById((request.userId),(err,ownerUser)=>{
                                                    
                                                                                                    if(!err){
                                                //sending mail 
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'toshikverma1@gmail.com', // Your email id
        pass: '123123123a' // Your password
        }
    });
    var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
    var mailOptions = {
        from: 'toshikverma@gmail.com', // sender address
        to: ownerUser.email, // list of receivers
        subject: 'Approvals', // Subject line
        html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your Request is Rejected!",productName:request.requestName,reason:req.body.description},(err)=>{
        if(err){
            console.log(err);
        }
        }) 
        
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        console.log(err)
        
        else
        console.log(info);
    });
    //sending mail ends
                                                                                                    }});          
                                                newNotification.save();
                                            res.status(200).send({message:"Request rejected!"});
                                        }else{

                                            res.status(400).send({message:"some problem occured"});
                                        }
                                    
                                    });

                              
                                    }


                        }else{

                            res.status(400).send(err);
                        }

                    
                });
                    
                    
 
 
             }else{
                 res.status(400).json({ message: 'invalid token!' });
 
             }
       
         }
        
     }else{
 
             res.status(400).send(err);
         }
   
 });
     }
             });
   });
    //approving link
    api.put('/rejectlink/:id', (req, res) => {
        //check token
          User.findOne({email:req.body.email},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not found!' });
         }else{
     Login.findOne({email:req.body.email},(err,login)=>{
     
         if(!err){
     
             if(login==undefined){ //user not found
     
                 res.status(400).json({ message: 'User not Logged In!' });
             }else{
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.linkApproved=2;
                                        request.save((err)=>{
    
                                            if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="Link Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
                                                User.findById((request.userId),(err,ownerUser)=>{
                                                    
                                                                                                    if(!err){
                                                //sending mail 
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'toshikverma1@gmail.com', // Your email id
        pass: '123123123a' // Your password
        }
    });
    var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
    var mailOptions = {
        from: 'toshikverma@gmail.com', // sender address
        to: ownerUser.email, // list of receivers
        subject: 'Approvals', // Subject line
        html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your Link is rejected!",productName:request.requestName,reason:req.body.description},(err)=>{
        if(err){
            console.log(err);
        }
        }) 
        
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        console.log(err)
        
        else
        console.log(info);
    });
    //sending mail ends
                                                                                                    }});        
                                                newNotification.save();
                                                res.status(200).send({message:"Link  rejected!"});
                                            }else{
    
                                                res.status(400).send({message:"some problem occured"});
                                            }
                                        
                                        });
    
                                  
                                        }
    
    
                            }else{
    
                                res.status(400).send(err);
                            }
    
                        
                    });
                        
                        
     
     
                 }else{
                     res.status(400).json({ message: 'invalid token!' });
     
                 }
           
             }
            
         }else{
     
                 res.status(400).send(err);
             }
       
     });
         }
                 });
       });
       //approving  iamges
    api.put('/rejectimages/:id', (req, res) => {
        //check token
          User.findOne({email:req.body.email},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not found!' });
         }else{
     Login.findOne({email:req.body.email},(err,login)=>{
     
         if(!err){
     
             if(login==undefined){ //user not found
     
                 res.status(400).json({ message: 'User not Logged In!' });
             }else{
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.imageApproved=2;
                                        request.save((err)=>{
    
                                            if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="Images Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
                                                User.findById((request.userId),(err,ownerUser)=>{
                                                    
                                                                                                    if(!err){
                                                //sending mail 
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'toshikverma1@gmail.com', // Your email id
        pass: '123123123a' // Your password
        }
    });
    var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
    var mailOptions = {
        from: 'toshikverma@gmail.com', // sender address
        to: ownerUser.email, // list of receivers
        subject: 'Approvals', // Subject line
        html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your image/images is/are Rejected",productName:request.requestName,reason:req.body.description},(err)=>{
        if(err){
            console.log(err);
        }
        }) 
        
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        console.log(err)
        
        else
        console.log(info);
    });
    //sending mail ends
                                                                                                    }});        
                                                newNotification.save();
                                                res.status(200).send({message:"image reject!"});
                                            }else{
    
                                                res.status(400).send({message:"some problem occured"});
                                            }
                                        
                                        });
    
                                  
                                        }
    
    
                            }else{
    
                                res.status(400).send(err);
                            }
    
                        
                    });
                        
                        
     
     
                 }else{
                     res.status(400).json({ message: 'invalid token!' });
     
                 }
           
             }
            
         }else{
     
                 res.status(400).send(err);
             }
       
     });
         }
                 });
       });
       //GET REQUESTS BY DYNAMIC QUERY
    api.get('/dynamic/:token/:query/:sortby/:page', (req, res) => {
        //check token
          Login.findOne({token:req.params.token},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not Login!' },);
         }else{
            
    
                let sort=["date","rating"];
                let sortby="date";
                if(sort.indexOf(req.params.sortby) > -1){

                    sortby=req.params.sortby;
                }
                //checking if page number is correct
                let pageNumber=1
        
                if(!isNaN(req.params.page)){
                   pageNumber=req.params.page;
                 }
                 //async query start here
                 
                 let qry=JSON.parse(decodeURIComponent(req.params.query));
    
                 var countQuery = function(callback){
                    Product.find(qry, function(err, doc){
                          if(err){ callback(err, null) }
                          else{
                              callback(null, doc.length);
                           }
                    }
                    )};
            
               var retrieveQuery = function(callback){
                 
                   Product.find(qry).skip((pageNumber-1)*12).sort({sortby: -1}).limit(12).exec(function(err, doc){
                    if(err){ callback(err, null) }
                    else{
                        callback(null, doc);
                     }
              });
                   
              };
            
 
               async.parallel([countQuery, retrieveQuery], function(err, results){
                   if(err){
                   // console.log("error here");
                    res.status(500).send(err);
                   }else{
                    res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
                   }
               });
           
         }
                 });
       });  
         //GET Requests BY SEARCH QUERY
    api.get('/search/:token/:search/:page', (req, res) => {
        //check token
          Login.findOne({token:req.params.token},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not Login!' },);
         }else{
                
                //checking if page number is correct
                let pageNumber=1
        
                if(!isNaN(req.params.page)){
                   pageNumber=req.params.page;
                 }
                 //async query start here
                 var countQuery = function(callback){
                    Requests.find({requestName: new RegExp(req.params.search,"i")}, function(err, doc){
                          if(err){ callback(err, null) }
                          else{
                              callback(null, doc.length);
                           }
                    }
                    )};
            
               var retrieveQuery = function(callback){
                Requests.find({requestName: new RegExp(req.params.search,"i")}).skip((pageNumber-1)*12).limit(12).exec(function(err, doc){
                    if(err){ callback(err, null) }
                    else{
                        callback(null, doc);
                     }
              });
                   
              };
            
               async.parallel([countQuery, retrieveQuery], function(err, results){
                   if(err){
                   // console.log("error here");
                    res.status(500).send(err);
                   }else{
                    res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
                   }
               });
            
         }
                 });
       });            
  return api;
}
