import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Product from '../model/product';
import Bid from '../model/bid';
import User from '../model/user';
import nodemailer from 'nodemailer';
import async from 'async';
import fs from 'fs';
import ejs from 'ejs';
import Notification from '../model/notification';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

  // '/v1/bid/add/emailID'
  api.post('/add', (req, res) => {
   //check token match token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //token matching
                Product.findOne({_id:req.body.productId},(err,product)=>{

                   
                        if(!err){
                                if(product===undefined){

                                    res.status(400).send({message:"no such product exsist"});
                                }else{
                            
                                    let newBid= new Bid();
                                    newBid.amount=req.body.amount;
                                    newBid.days=req.body.days;
                                    newBid.productId=req.body.productId;
                                    newBid.userId=user._id;
                                    newBid.description=req.body.description;
                                    newBid.userName=req.body.userName;
                                    newBid.productName=req.body.productName;
                                    newBid.productById=product.userId;
                                    newBid.save((err,bid)=>{

                                        if(!err){
                                            let newNotification=new Notification();
                                            newNotification.userId=product.userId;
                                            newNotification.message="Bid added!"
                                            newNotification.description="You have recieved Bid on "+product.productName;
                                            newNotification.type=3;
                                            newNotification.refId=product._id;
                                            newNotification.link="/product";
                                            newNotification.save();
                                            User.findById((product.userId),(err,ownerUser)=>{

                                                if(!err){
                                                //sending mail 
                                                var transporter = nodemailer.createTransport({
                                                    service: 'Gmail',
                                                    auth: {
                                                    user: 'toshikverma1@gmail.com', // Your email id
                                                    pass: '123123123a' // Your password
                                                    }
                                                });
                                                var templateString = fs.readFileSync('views/bidrecieved.ejs', 'utf-8');
                                                var mailOptions = {
                                                    from: 'toshikverma@gmail.com', // sender address
                                                    to: ownerUser.email, // list of receivers
                                                    subject: 'Bid Recieved!', // Subject line
                                                    html: ejs.render(templateString,{heading:"Bid Recieved!",name:ownerUser.fname,productName:product.productName,byperson:user.fname},(err)=>{
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

                                                }else{
                                                    console.log(err);
                                                }
                                            });
                                             
                                            res.status(200).json(bid);
                                        }else{

                                            res.status(400).send({message:"bid was not saved"});
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

   // '/v1/bid/update/bidId 
  api.put('/update/:id', (req, res) => {
    //check password or match password
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found in login table
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //token matching
                Bid.findOne({_id:req.params.id},(err,bid)=>{

                   
                        if(!err){
                                if(bid===undefined){

                                    res.status(400).send({message:"no such bid exsist"});
                                }else{
                                    if(user._id.equals(bid.userId) || login.userType>0){ //here user who created the product can make changes and the admin
                
                                    bid.amount=req.body.amount;
                                    bid.days=req.body.days;
                                    bid.description=req.body.description;
                                    bid.lastedit=Date();
                                    bid.save((err,bid)=>{

                                        if(!err){

                                            res.status(200).send(bid);
                                        }else{

                                            res.status(400).send({message:"bid was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to update bid"});
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
    // '/v1/bid/delete/bidId 
  api.delete('/delete/:id', (req, res) => {
    //check password or match password
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found in login table
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //token matching
                Bid.findOne({_id:req.params.id},(err,bid)=>{

                   
                        if(!err){
                                if(bid===undefined){

                                    res.status(400).send({message:"no such bid exsist"});
                                }else{
                                    if(user._id.equals(bid.userId) || login.userType>0){ //here user who created the product can make changes and the admin
                
                                    
                                    bid.remove((err,bid)=>{

                                        if(!err){

                                            res.status(200).json({message:"bid deleted successfully!"});
                                        }else{

                                            res.status(400).send({message:"bid was not deleted"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to update bid"});
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
   // '/v1/bid/marasspam/bidId 
   api.put('/markasspam/:id', (req, res) => {
    //check tokenr match token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token){  //token matching
                Product.findOne({_id:req.body.productId},(err,product)=>{

                   
                        if(!err){
                                if(product===undefined){

                                    res.status(400).send({message:"no such product exsist"});
                                }else{
                                    Bid.findOne({_id:req.params.id},(err,bid)=>{
                                        if(bid===undefined){
                                            
                                                                                res.status(400).send({message:"no such bid exsist"});
                                                                            }else{
                                if(user._id.equals(product.userId)){    
                                    bid.isSpam=1;
                                    bid.save((err,bid)=>{

                                        if(!err){

                                            res.status(200).json({message:"marked as spam!"});
                                        }else{

                                            res.status(400).send({message:"bid was not saved"});
                                        }
                                    
                                    });
                                }else{
                                    
                                        res.status(400).json({message:"you are not authorized to edit bid"});
                                    }
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

    //GET BIDS BY DYNAMIC QUERY
    api.get('/dynamic/:token/:query/:sortby/:page', (req, res) => {
        //check token
          Login.findOne({token:req.params.token},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not Login!' },);
         }else{
                let sort=["lastEdit","rating"];
                let sortby="lastEdit";
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
                    Bid.find(qry, function(err, doc){
                          if(err){ callback(err, null) }
                          else{
                              callback(null, doc.length);
                           }
                    }
                    )};
            
               var retrieveQuery = function(callback){
                   Bid.find(qry).skip((pageNumber-1)*12).sort({[sortby]: -1}).limit(12).exec(function(err, doc){
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
                    res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, bids: results[1]});
                   }
               });
            
         }
                 });
       });       
   return api;
}
