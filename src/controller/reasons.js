import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Product from '../model/product';
import Reasons from '../model/reasons';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a reasons
//v1/reasons/add
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
 
             if(login.token==req.body.token && user.userType>0){  //token matching and only admin can add
               let newreasons=new Reasons();
               newreasons.name=req.body.name;
               newreasons.save((err,reasons)=>{

                if(!err){

                    res.status(200).send(reasons);
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

//v1/reasons/update
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
 
             if(login.token==req.body.token && user.userType>0){  //token matching and only admin can add
              

              Reasons.findById((req.params.id),(err,reasons)=>{

                    if(!err){
                        if(reasons===undefined){
                            res.status(400).send({message:"no such reasons exsist!"});

                        }else{
                        reasons.name=req.body.name;
                        reasons.save((err)=>{

                            if(err){

                                res.status(500).send(err);
                            }else{

                                res.status(200).send({message:"reasons updated!"});
                            }

                        });
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

   //v1/reasons/delete
  api.delete('/delete/:id/:token/:email', (req, res) => {
    //check password or match password
      User.findOne({email:req.params.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.params.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token==req.params.token && user.userType>0){  //token matching and only admin can add
              

              Reasons.findById((req.params.id),(err,reasons)=>{

                    if(!err){
                        if(reasons===undefined){
                            res.status(400).send({message:"no such reasons exsist!"});

                        }else{
                        reasons.remove((err)=>{

                            if(!err){

                                res.status(200).send({message:"reasons deleted!"});
                            }else{

                                res.status(500).send(err);
                            }
                        });
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

//get reasons here
    api.post('/get', (req, res) => {
      Reasons.find({}, function(err, reasons) {
        res.json({"cities":reasons});
    });
});
  return api;
}
