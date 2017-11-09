import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Notification from '../model/notification';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

//v1/notification/get
api.post('/get', (req, res) => {
    //check password or match password token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token ){  //token matching and only admin can add
                     
                   Notification.find({userId:user._id},(err,notification)=>{
                    if(!err){
                        if(chat===undefined){

                            res.status(400).json({message:"no notification found!"});
                        }else{

                            res.status(200).json(notification);
                        }

                    }else{

                        res.status(500).send(err);
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
   //v1/notification/
api.post('/saw', (req, res) => {
    //check password or match password token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.body.token ){  //token matching and only admin can add
                     
                   Notification.update({userId:user._id},{$set:{saw:1}},{multi: true},(err,notification)=>{
                    if(!err){
                        if(notification===undefined){

                            res.status(400).json({message:"no notification found!"});
                        }else{

                            res.status(200).json({message:"saw notifications!"});
                        }

                    }else{

                        res.status(500).send(err);
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
