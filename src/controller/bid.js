import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Product from '../model/product';
import Bid from '../model/bid';
import User from '../model/user';
import Notification from '../model/notification';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

  // '/v1/bid/add/emailID'
  api.post('/add/:email', (req, res) => {
   //check token match token
      User.findOne({email:req.params.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.params.email},(err,login)=>{
 
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
                                            res.status(200).send(bid);
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
   return api;
}
