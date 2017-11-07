import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Product from '../model/product';
import Review from '../model/review';
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
                    newProduct.editTime=Date();
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
                                    product.editTime=Date();
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

    //adding a view
 api.put('/addview/:id', (req, res) => {
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
                            
                                  
                                product.pageView=product.pageView+1;
                                    product.save((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"increased page view"});
                                        }else{

                                            res.status(400).send({message:"some problem occured"});
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
   //adding to wishlist
   api.put('/addwishlist/:id', (req, res) => {
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
                                    let a=-1;
                                    if(product.wishList===undefined){
                                        product.wishList=user.email+",";
                                    }else{
                                    a=product.wishList.search(user.email+",");
                                     } 
                                     if(a<0){
                                        product.wishList=product.wishList+user.email+","
                                    product.save((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"added to wishlist "});
                                        }else{

                                            res.status(400).send({message:"some problem occured"});
                                        }
                                    
                                    });

                                }else{

                                    res.status(200).send({message:"added to wishlist "});
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
   //removing from wishlist
   api.put('/removewishlist/:id', (req, res) => {
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
                                    let a=-1;
                                    if(product.wishList===undefined){
                                        res.status(400).send({message:"wishlist is empty!"});
                                    }else{
                                    a=product.wishList.search(user.email+",");
                                     } 
                                     if(a>=0){
                                        product.wishList=product.wishList.replace(user.email+",","");
                                    product.save((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"removed from wishlist "});
                                        }else{

                                            res.status(400).send({message:"some problem occured"});
                                        }
                                    
                                    });

                                }else{

                                    res.status(200).send({message:"removed from wishlist "});
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

    //adding review
    api.put('/addreview/:id', (req, res) => {
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
                                        
                                            Review.findOne({userId:user._id,productId:req.params.id},(err,review)=>{

                                                if(!err){

                                                    if(review===null){
                                                        if(req.body.value>5 || req.body.value<.5){

                                                            res.status(400).send({message:"value of the rating should be between 0.5 and 5"});
                                                        }else{
                                                        let newReview=new Review();
                                                        newReview.userId=user._id;
                                                        newReview.productId=req.params.id;
                                                        newReview.value=req.body.value;
                                                        newReview.description=req.body.description;
                                                        product.ratings=((product.numberOfRatings*product.ratings)+req.body.value)/(product.numberOfRatings+1);
                                                        product.numberOfRatings=product.numberOfRatings+1;
                                                        newReview.save((err)=>{

                                                            if(!err){

                                                                
                                                                product.save((err)=>{

                                                                    if(err){

                                                                       res.status(500).send(err);
                                                                    }
                                                                     res.status(200).send({message:"review has been saved!"});
                                                                });
                                                            }else{

                                                                res.status(500).send(err);
                                                            }
                                                        });
                                                        
                                                    }
                                                }else{
                                                      
                                                      if(req.body.value>5 || req.body.value<.5){
                                                        
                                                       res.status(400).send({message:"value of the rating should be between 0.5 and 5"});
                                                        }else{
                                                      if(product.numberOfRatings===1){
                                                          product.ratings=req.body.value;
                                                      }else{
                                                    product.ratings=((product.numberOfRatings*product.ratings)-review.value)/(product.numberOfRatings-1);
                                                    product.ratings=(((product.numberOfRatings-1)*product.ratings)+req.body.value)/product.numberOfRatings;
                                                }
                                                    review.value=req.body.value;
                                                    review.description=req.body.description;
                                                    review.save((err)=>{

                                                        if(!err){

                                                           
                                                            product.save((err)=>{

                                                               if(err){

                                                                       res.status(500).send(err);
                                                                    }
                                                                     res.status(200).send({message:"review has been saved!"});
                                                            });
                                                        }else{

                                                            res.status(500).send(err);
                                                        }
                                                    });
                                                }
                                            
                                           } 
                                        }else{

                                                res.status(500).send(err);
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
