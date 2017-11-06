import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Product from '../model/product';
import User from '../model/user';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

  // '/v1/product/add/emailID'
  api.post('/add/:email', (req, res) => {
   //check token
   console.log("am here");
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
               
                    let newProduct=new Product();
                    newProduct.productName=req.body.productName;
                   // newproduct.image=req.body.name; saved for later
                   newProduct.productAge=req.body.paroductAge;
                   newProduct.ProductDescription=req.body.description;
                   newProduct.referenceLink=req.body.referenceLink;
                   newProduct.college=user.college;
                    newProduct.userId=user._id,
                    newProduct.rentPerAmount=req.body.rentPerAmount,
                    newProduct.condition=req.body.condition,
                    newProduct.rentTimeType=req.body.rentTimeType,
                    newProduct.isSecurityAmount=req.body.isSecurityAmount,
                    newProduct.securityAmount=req.body.securityAmount,
                    newProduct.save((err,product)=>{

                        if(!err){
                                res.status(200).json(product);

                        }else{

                                res.status(400).json({message:"product not saved!"});
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

  //updating a product

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
 
             if(login.token==req.body.token){  //token matching
                Product.findOne({_id:req.params.id},(err,product)=>{

                   
                        if(!err){
                                if(product===undefined){

                                    res.status(400).send({message:"no such product exsist"});
                                }else{
                               console.log(user._id);
                               console.log(product.userId);
                                    if(user._id.equals(product.userId) || login.userType>0){ //here user who created the product can make changes and the admin
                                    product.productName=req.body.productName;
                                    product.productDescription=req.body.description;
                                    product.referenceLink=req.body.referenceLink;
                                    product.condition=req.body.condition;
                                    product.rentPerAmount=req.body.rentPerAmount;
                                    product.rentTimeType=req.body.rentTimeType;
                                    product.isSecurityAmount=req.body.isSecurityAmount;
                                    product.securityAmount=req.body.securityAmount;
                                    product.productAge=req.body.productAge;
                                    product.save((err,product)=>{

                                        if(!err){

                                            res.status(200).send(product);
                                        }else{

                                            res.status(400).send({message:"product was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to update product"});
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
 //deleting a product
 api.delete('/delete/:id', (req, res) => {
    //check token
      User.findOne({email:req.body.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.body.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token===req.body.token){  //token matching
                Product.findOne({_id:req.params.id},(err,product)=>{

                   
                        if(!err){
                                if(product===undefined){

                                    res.status(400).send({message:"no such product exsist"});
                                }else{
                               console.log(user._id);
                               console.log(product.userId);
                                    if(user._id.equals(product.userId) || login.userType>0){
                                
                                    product.remove((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"product deleted successsfully!"});
                                        }else{

                                            res.status(400).send({message:"product was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to delete product"});
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
  return api;
}
