import mongoose from 'mongoose';
import { Router } from 'express';
import async from 'async';
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
                  
                    //checking if page number is correct
                    let pageNumber=1
            
                    if(!isNaN(req.body.page)){
                       pageNumber=req.body.page;
                     }
                     //async query start here
                     console.log("query started");
                     var countQuery = function(callback){
                         Notification.find({userId:user._id}, function(err, doc){
                              if(err){ callback(err, null) }
                              else{
                                  callback(null, doc.length);
                               }
                        }
                        )};
                
                   var retrieveQuery = function(callback){
                       console.log((pageNumber-1)*12);
                          Notification.find({userId:user._id}).skip((pageNumber-1)*12).sort({time: -1}).limit(12).exec(function(err, doc){
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
                        res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
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
