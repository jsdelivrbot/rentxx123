import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Forgotpassword from '../model/forgotpassword';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

//v1/forgotpassword/get
api.get('/add/:email', (req, res) => {
    //check password or match password token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
         Forgotpassword.findOne({email:req.params.email},(err,forgotpassword)=>{

            if(!err){
                if(forgotpassword==undefined){

                    let newForgotpassword=new Forgotpassword();
                    newForgotpassword.email=req.params.email;
                    newForgotpassword.save((err)=>{

                        if(!err){

                            res.status(200).json({message:"added!"});
                        }else{

                            res.status(500).send(err);
                        }

                    });
                }else{
                    res.status(200).json({message:"added!"});

                }

            }else{

                res.status(500).send(err);
            }
         });

     }
             });
   });
   //v1/forgotpassword/
api.post('/change/:key/:email', (req, res) => {
    //check password or match password token
      User.findOne({email:req.params.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Forgotpassword.findOne({email:req.params.email},(err,forgotpassword)=>{
 
     if(!err){
 
         if(forgotpassword==undefined){ //user not found
 
             res.status(400).json({ message: 'Create a key again' });
         }else{
 
             if(forgotpassword.key==req.params.key ){  //token matching and only admin can add
                  //changing password here
                  User.findOne({email:req.params.email},(err,user)=>{
                    if(user===undefined){
                        res.status(400).json({ message: 'User not found!' });
                    }else{
                        user.password=req.body.password;
                        user.save((err)=>{


                                if(!err){

                                    res.status(200).json({message:"password changed"});
                                }else{

                                    res.status(500).send(err);
                                }
                        });
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
