import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import Product from '../model/product';
import SubCategory from '../model/subCategory';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a category
//v1/category/add
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
               let newCategory=new SubCategory();
               newCategory.name=req.body.name;
               newCategory.category=req.body.category;
               newCategory.save((err,subcat)=>{

                if(!err){

                    res.status(200).send(subcat);
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

//v1/category/update
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
              

                SubCategory.findById((req.params.id),(err,category)=>{

                    if(!err){
                        if(category===undefined){
                            res.status(400).send({message:"no such subcategory exsist!"});

                        }else{
                        category.name=req.body.name;
                        category.category=req.body.category;
                        category.save((err,SubCategory)=>{

                            if(err){

                                res.status(500).send(err);
                            }else{

                                res.status(200).send(subcat);
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

   //v1/category/update
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
              

                SubCategory.findById((req.params.id),(err,category)=>{

                    if(!err){
                        if(category===undefined){
                            res.status(400).send({message:"no such subcategory exsist!"});

                        }else{
                        category.remove((err)=>{

                            if(!err){

                                res.status(200).send({message:"subcategory deleted!"});
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

    //get subCategory here
    api.post('/get', (req, res) => {
      Category.find({}, function(err, subcat) {
        res.json({"subCategories":subcat});
    });
});
  return api;
}
