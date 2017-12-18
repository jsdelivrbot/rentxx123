import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Product from '../model/product';
import City from '../model/city';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a city
//v1/city/add
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
               let newcity=new City();
               newcity.name=req.body.name;
               newcity.save((err)=>{

                if(!err){

                    res.status(200).send({message:"city added!"});
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

//v1/city/update
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
              

              City.findById((req.params.id),(err,city)=>{

                    if(!err){
                        if(city===undefined){
                            res.status(400).send({message:"no such city exsist!"});

                        }else{
                        city.name=req.body.name;
                        city.save((err)=>{

                            if(err){

                                res.status(500).send(err);
                            }else{

                                res.status(200).send({message:"city updated!"});
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

   //v1/city/delete
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
              

              City.findById((req.params.id),(err,city)=>{

                    if(!err){
                        if(city===undefined){
                            res.status(400).send({message:"no such city exsist!"});

                        }else{
                        city.remove((err)=>{

                            if(!err){

                                res.status(200).send({message:"city deleted!"});
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

//get cities here
    api.post('/get', (req, res) => {
      City.find({}, function(err, cities) {
        res.json({"cities":cities});
    });
});
  return api;
}
