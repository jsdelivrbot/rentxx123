import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Chat from '../model/chat';
import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import Notification from '../model/notification';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a category
//v1/chat/add
  api.post('/add', (req, res) => {
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
 
             if(login.token==req.body.token ){  //token matching and only admin can add
                let newChat=new Chat();
               newChat.from=user._id;
               newChat.towards=req.body.towards;
             
               newChat.chatId = parseInt(user._id, 16) > parseInt(req.body.towards, 16) ? user._id + req.body.towards : req.body.towards + user._id;
               newChat.message=req.body.message;
               newChat.save((err,chatValue)=>{

                if(!err){
                    Notification.findOne({
                        
                        $and: [
                            { userId:req.body.towards },
                            { $or: [{ saw:1 }, { saw:0 }] }
                        ]},(err,notification)=>{

                        if(!err){

                            if(notification==null){
                                let newNotification=new Notification();
                                newNotification.userId=req.body.towards;
                                newNotification.message="You have a message!"
                                newNotification.description="Message recieved from "+user.fname;
                                newNotification.type=1;
                                newNotification.refId=user._id;
                                newNotification.link="/chat";
                                newNotification.save();
                                User.findById((req.body.towards),(err,ownerUser)=>{
                                    
                                                                                    if(!err){
                                                                                    
  //sending mail 
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
    user: 'toshikverma1@gmail.com', // Your email id
    pass: '123123123a' // Your password
    }
});
var templateString = fs.readFileSync('views/chat.ejs', 'utf-8');
var mailOptions = {
    from: 'toshikverma@gmail.com', // sender address
    to: ownerUser.email, // list of receivers
    subject: 'Message Recieved!', // Subject line
    html: ejs.render(templateString,{heading:"Message Recieved!",name:ownerUser.fname,message:req.body.message,byperson:user.fname},(err)=>{
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
                            }else{
                                
                                notification.saw=0;
                                notification.time=Date.now();
                                notification.save();
                            }
                        }

                    });
                   
                    res.status(200).send(chatValue);
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
//v1/chat/get
api.post('/get', (req, res) => {
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
 
             if(login.token==req.body.token ){  //token matching and only admin can add
                
                let chatId = parseInt(user._id, 16) > parseInt(req.body.userId, 16) ? user._id + req.body.userId : req.body.userId + user._id;
                    
                   Chat.find({chatId:chatId},(err,chat)=>{
                    if(!err){
                        if(chat===undefined){

                            res.status(200).json({});
                        }else{

                            res.status(200).json(chat);
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

   //v1/chat/get
api.post('/getAll', (req, res) => {
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
 
             if(login.token==req.body.token ){  //token matching and only admin can add
                
               
                    
                   Chat.aggregate([
    { 
        $match: { 
            $or: [
                { from: user._id }, 
                { towards:user._id }
            ]                   
        } 
    },
    {$group:{_id: '$chatId', message:'$message',time:'$time'}},
    { 
        $lookup: { 
            from: "users", 
            localField: "from", 
            foreignField: "_id", 
            as: "fromName" 
        }
        
    },
    { 
        $lookup: { 
             from: "users", 
            localField: "towards", 
            foreignField: "_id", 
            as: "towardsName" 
        }
        
    }],
    (err,chat)=>{
                    if(!err){
                        if(chat===undefined){

                            res.status(200).json({});
                        }else{

                            res.status(200).json(chat);
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
