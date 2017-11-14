import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Product from '../model/product';
import College from '../model/college';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a college
//v1/college/add
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
               let newcollege=new College();
               newcollege.name=req.body.name;
               newcollege.city=req.body.city;
               newcollege.save((err)=>{

                if(!err){

                    res.status(200).send({message:"college added!"});
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

//v1/college/update
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
              

              College.findById((req.params.id),(err,college)=>{

                    if(!err){
                        if(college===undefined){
                            res.status(400).send({message:"no such college exsist!"});

                        }else{
                        college.name=req.body.name;
                        college.city=req.body.city;
                        college.save((err)=>{

                            if(err){

                                res.status(500).send(err);
                            }else{

                                res.status(200).send({message:"college updated!"});
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

   //v1/college/update
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
 
             if(login.token==req.body.token && user.userType>0){  //token matching and only admin can add
              

              College.findById((req.params.id),(err,college)=>{

                    if(!err){
                        if(college===undefined){
                            res.status(400).send({message:"no such college exsist!"});

                        }else{
                        college.remove((err)=>{

                            if(!err){

                                res.status(200).send({message:"college deleted!"});
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
  return api;
}
