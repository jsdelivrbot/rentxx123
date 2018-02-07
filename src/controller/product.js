import mongoose from 'mongoose';
import async from 'async';
import { Router } from 'express';
import Login from '../model/login';
import Product from '../model/product';
import Review from '../model/review';
import User from '../model/user';
import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import College from '../model/college';
import Category from '../model/category';
import Notification from '../model/notification';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

  // '/v1/product/add/emailID'
  api.post('/add', (req, res) => {
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

            if(login.token==req.body.token){  //token matching
               
                    let newProduct=new Product();
                    newProduct.productName=req.body.productName;
                   // newproduct.image=req.body.name; saved for later
                   newProduct.productAge=req.body.productAge;
                   newProduct.productDescription=req.body.description;
                   newProduct.referenceLink=req.body.referenceLink;
                   newProduct.college=user.college;
                   newProduct.city=user.city;
                   newProduct.image1=req.body.image1;
                   newProduct.image2=req.body.image2;
                   newProduct.image3=req.body.image3;
                   newProduct.image4=req.body.image4;
                    newProduct.userId=user._id,
                    newProduct.rentPerAmount=req.body.rentPerAmount,
                    newProduct.condition=req.body.condition,
                    newProduct.rentTimeType=req.body.rentTimeType,
                    newProduct.isSecurityAmount=req.body.isSecurityAmount,
                    newProduct.userName=req.body.userName,
                    newProduct.securityAmount=req.body.securityAmount,
                    newProduct.save((err,product)=>{

                        if(!err){
                            let newNotification=new Notification();
                            newNotification.userId=user._id;
                            newNotification.message="Status Pending!"
                            newNotification.description="You product "+product.productName+" is peding on approval by moderators will get back to you soon!";
                            newNotification.type=1;
                            newNotification.refId=user._id;
                            newNotification.link="/product";
                            //sending mail 
                            var transporter = nodemailer.createTransport({
                              service: 'Gmail',
                              auth: {
                              user: 'toshikverma1@gmail.com', // Your email id
                              pass: '123123123a' // Your password
                              }
                          });
                          var templateString = fs.readFileSync('views/approvals.ejs', 'utf-8');
                          var mailOptions = {
                              from: 'toshikverma@gmail.com', // sender address
                              to: user.email, // list of receivers
                              subject: 'Product Saved', // Subject line
                              html: ejs.render(templateString,{heading:"pending approval",name:user.fname,message:"Your Product is upload and pending approval!",productName:req.body.productName},(err)=>{
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
                                                                                                                            
                            newNotification.save();
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
                                    product.lastEdit=Date();
                                    product.image1=req.body.image1;
                                    product.image2=req.body.image2;
                                    product.image3=req.body.image3;
                                    product.image4=req.body.image4;
                                    product.imageApproved=0;
                                    product.linkApproved=0;
                                    product.productApproved=0;
                                    product.facebookLink=req.body.facebooklink;
                                    product.youtubeLink=req.body.youtubelink;
                                    product.twitterLink=req.body.twitterlink;
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
 api.delete('/delete/:id/:token/:email', (req, res) => {
    //check token
      User.findOne({email:req.params.email},(err,user)=>{
        if(user==undefined){
         res.status(400).json({ message: 'User not found!' });
     }else{
 Login.findOne({email:req.params.email},(err,login)=>{
 
     if(!err){
 
         if(login==undefined){ //user not found
 
             res.status(400).json({ message: 'User not Logged In!' });
         }else{
 
             if(login.token===req.params.token){  //token matching
                Product.findOne({_id:req.params.id},(err,product)=>{

                   
                        if(!err){
                                if(product===undefined || product===null){
                                    console.log("I was here!!!!!!!");
                                    res.status(404).json({message:"no such product exsist"});
                                }else{

                                    if(user._id.equals(product.userId) || login.userType>0){
                                
                                    product.remove((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"product deleted successsfully!"});
                                        }else{

                                            res.status(400).send({message:"product was not deleted"});
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
 
             res.status(500).send(err);
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

       //approvals starts here!
       //approving product
       api.put('/approveproduct/:id', (req, res) => {
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
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Product.findOne({_id:req.params.id},(err,product)=>{
    
                       
                            if(!err){
                                    if(product===undefined){
    
                                        res.status(400).send({message:"no such product exsist"});
                                    }else{
                                
                                      
                                    product.productApproved=1;
                                        product.save((err)=>{
    
                                            if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=product.userId;
                                                newNotification.message="Product Approved!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=product._id;
                                                newNotification.link="/product";
                                                User.findById((product.userId),(err,ownerUser)=>{
                                                    
                                                                                                    if(!err){
                                                //sending mail 
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'toshikverma1@gmail.com', // Your email id
        pass: '123123123a' // Your password
        }
    });
    var templateString = fs.readFileSync('views/approvals.ejs', 'utf-8');
    var mailOptions = {
        from: 'toshikverma@gmail.com', // sender address
        to: ownerUser.email, // list of receivers
        subject: 'Approvals', // Subject line
        html: ejs.render(templateString,{heading:"Accepted",name:ownerUser.fname,message:"Your Product is Approved!",productName:product.productName},(err)=>{
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
                                                newNotification.save();
                                                res.status(200).send({message:"product approved!"});
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
        //approving link
        api.put('/approvelink/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.linkApproved=1;
                                            product.save((err)=>{
        
                                                if(!err){
        
                                                    res.status(200).send({message:"link  approved!"});
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
           //approving  iamges
        api.put('/approveimages/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.imageApproved=1;
                                            product.save((err)=>{
        
                                                if(!err){
        
                                                    res.status(200).send({message:"image approved!"});
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
            //rejecting product
       api.put('/rejectproduct/:id', (req, res) => {
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
     
                if(login.token==req.body.token && user.userType>0){  //token matching
                    Product.findOne({_id:req.params.id},(err,product)=>{
    
                       
                            if(!err){
                                    if(product===undefined){
    
                                        res.status(400).send({message:"no such product exsist"});
                                    }else{
                                
                                      
                                    product.productApproved=2;
                                        product.save((err)=>{
    
                                            if(!err){
                                                    let newNotification=new Notification();
                                                    newNotification.userId=product.userId;
                                                    newNotification.message="Product Rejected!"
                                                    newNotification.description=req.body.description;
                                                    newNotification.type=1;
                                                    newNotification.refId=product._id;
                                                    newNotification.link="/product";
                                                    User.findById((product.userId),(err,ownerUser)=>{
                                                        
                                                                                                        if(!err){
                                                    //sending mail 
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'toshikverma1@gmail.com', // Your email id
            pass: '123123123a' // Your password
            }
        });
        var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
        var mailOptions = {
            from: 'toshikverma@gmail.com', // sender address
            to: ownerUser.email, // list of receivers
            subject: 'Approvals', // Subject line
            html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your Product is Rejected!",productName:product.productName,reason:req.body.description},(err)=>{
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
                                                    newNotification.save();
                                                res.status(200).send({message:"product rejected!"});
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
        //approving link
        api.put('/rejectlink/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.linkApproved=0;
                                            product.save((err)=>{
        
                                                if(!err){
                                                    let newNotification=new Notification();
                                                    newNotification.userId=product.userId;
                                                    newNotification.message="Link Rejected!"
                                                    newNotification.description=req.body.description;
                                                    newNotification.type=1;
                                                    newNotification.refId=product._id;
                                                    newNotification.link="/product";
                                                    User.findById((product.userId),(err,ownerUser)=>{
                                                        
                                                                                                        if(!err){
                                                    //sending mail 
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'toshikverma1@gmail.com', // Your email id
            pass: '123123123a' // Your password
            }
        });
        var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
        var mailOptions = {
            from: 'toshikverma@gmail.com', // sender address
            to: ownerUser.email, // list of receivers
            subject: 'Approvals', // Subject line
            html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your Link is Rejected!",productName:product.productName,reason:req.body.description},(err)=>{
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
                                                    newNotification.save();
                                                    res.status(200).send({message:"link  rejected!"});
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
           //approving  iamges
        api.put('/rejectimages/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.imageApproved=0;
                                            product.save((err)=>{
        
                                                if(!err){
                                                    let newNotification=new Notification();
                                                    newNotification.userId=product.userId;
                                                    newNotification.message="Images Rejected!"
                                                    newNotification.description=req.body.description;
                                                    newNotification.type=1;
                                                    newNotification.refId=product._id;
                                                    newNotification.link="/product";
                                                    User.findById((product.userId),(err,ownerUser)=>{
                                                        
                                                                                                        if(!err){
                                                    //sending mail 
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: 'toshikverma1@gmail.com', // Your email id
            pass: '123123123a' // Your password
            }
        });
        var templateString = fs.readFileSync('views/rejected.ejs', 'utf-8');
        var mailOptions = {
            from: 'toshikverma@gmail.com', // sender address
            to: ownerUser.email, // list of receivers
            subject: 'Approvals', // Subject line
            html: ejs.render(templateString,{heading:"Rejected",name:ownerUser.fname,message:"Your Images is Rejected!",productName:product.productName,reason:req.body.description},(err)=>{
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
                                                    newNotification.save();
                                                    res.status(200).send({message:"image reject!"});
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
           //GET PRODUCTS BY COLLEGE
           api.get('/productsbycollege/:token/:collegeId/:sortby/:page', (req, res) => {
            //check token
              Login.findOne({token:req.params.token},(err,user)=>{
                if(user==undefined){
                 res.status(400).json({ message: 'User not Login!' },);
             }else{
                 //checking correct college
                College.findOne({email:req.params.collegeId},(err,user)=>{
                    //checking correct sort if wrong sort by date
                    let sort=["date","rating"];
                    let sortby="date";
                    if(sort.indexOf(req.params.sortby) > -1){

                        sortby=req.params.sortby;
                    }
                    //checking if page number is correct
                    let pageNumber=1
            
                    if(!isNaN(req.params.page)){
                       pageNumber=req.params.page;
                     }
                     //async query start here
                     console.log("query started");
                     var countQuery = function(callback){
                        Product.find({college:req.params.collegeId}, function(err, doc){
                              if(err){ callback(err, null) }
                              else{
                                  callback(null, doc.length);
                               }
                        }
                        )};
                
                   var retrieveQuery = function(callback){
                       console.log((pageNumber-1)*12);
                       Product.find({college:req.params.collegeId}).skip((pageNumber-1)*12).sort({sortby: -1}).limit(12).exec(function(err, doc){
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
                });
             }
                     });
           });

           //GET single product
           api.get('/singleproduct/:id', (req, res) => {
            
                Product.findById({_id:req.params.id},(err,prod)=>{
                    if(!err){
                        res.status(200).json({product:prod});
                    }else{
                        res.status(404).json({message:"no product found!"})
                    }
                  
              });
           }
           );
           //GET PRODUCTS BY CATEGORY
           api.get('/productsbycategory/:token/:category/:sortby/:page', (req, res) => {
            //check token
              Login.findOne({token:req.params.token},(err,user)=>{
                if(user==undefined){
                 res.status(400).json({ message: 'User not Login!' },);
             }else{
                 //checking correct category
                Category.findOne({_id:req.params.category},(err,user)=>{
                    //checking correct sort if wrong sort by date
                    let sort=["date","rating"];
                    let sortby="date";
                    if(sort.indexOf(req.params.sortby) > -1){

                        sortby=req.params.sortby;
                    }
                    //checking if page number is correct
                    let pageNumber=1
            
                    if(!isNaN(req.params.page)){
                       pageNumber=req.params.page;
                     }
                     //async query start here
                     console.log("query started");
                     var countQuery = function(callback){
                        Product.find({category:req.params.category}, function(err, doc){
                              if(err){ callback(err, null) }
                              else{
                                  callback(null, doc.length);
                               }
                        }
                        )};
                
                   var retrieveQuery = function(callback){
                       console.log((pageNumber-1)*12);
                       Product.find({category:req.params.category}).skip((pageNumber-1)*12).sort({sortby: -1}).limit(12).exec(function(err, doc){
                        if(err){ callback(err, null) }
                        else{
                            callback(null, doc);
                         }
                  });
                       
                  };
                
                console.log(retrieveQuery);
                   async.parallel([countQuery, retrieveQuery], function(err, results){
                       if(err){
                       // console.log("error here");
                        res.status(500).send(err);
                       }else{
                        res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
                       }
                   });
                });
             }
                     });
           });
    //GET PRODUCTS BY DYNAMIC QUERY
    api.get('/dynamic/:token/:query/:sortby/:page', (req, res) => {
        //check token
          Login.findOne({token:req.params.token},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not Login!' },);
         }else{
                let sort=["lastEdit","rating"];
                let sortby="lastEdit";
                if(sort.indexOf(req.params.sortby) > -1){

                    sortby=req.params.sortby;
                }
                //checking if page number is correct
                let pageNumber=1
        
                if(!isNaN(req.params.page)){
                   pageNumber=req.params.page;
                 }
                 //async query start here
                 
                 let qry=JSON.parse(decodeURIComponent(req.params.query));
                 var countQuery = function(callback){
                    Product.find(qry, function(err, doc){
                          if(err){ callback(err, null) }
                          else{
                              callback(null, doc.length);
                           }
                    }
                    )};
            
               var retrieveQuery = function(callback){
                   Product.find(qry).skip((pageNumber-1)*12).sort({[sortby]: -1}).limit(12).exec(function(err, doc){
                    if(err){ callback(err, null) }
                    else{
                        callback(null, doc);
                     }
              });
                   
              };
            
               async.parallel([countQuery, retrieveQuery], function(err, results){
                   if(err){
                   // console.log("error here");
                    res.status(500).send(err);
                   }else{
                    res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
                   }
               });
            
         }
                 });
       });       

       //GET PRODUCTS BY SEARCH QUERY
    api.get('/search/:token/:search/:page', (req, res) => {
        //check token
          Login.findOne({token:req.params.token},(err,user)=>{
            if(user==undefined){
             res.status(400).json({ message: 'User not Login!' },);
         }else{
                
                //checking if page number is correct
                let pageNumber=1
        
                if(!isNaN(req.params.page)){
                   pageNumber=req.params.page;
                 }
                 //async query start here
                 var countQuery = function(callback){
                    Product.find({productName: new RegExp(req.params.search,"i")}, function(err, doc){
                          if(err){ callback(err, null) }
                          else{
                              callback(null, doc.length);
                           }
                    }
                    )};
            
               var retrieveQuery = function(callback){
                   Product.find({productName: new RegExp(req.params.search,"i")}).skip((pageNumber-1)*12).limit(12).exec(function(err, doc){
                    if(err){ callback(err, null) }
                    else{
                        callback(null, doc);
                     }
              });
                   
              };
            
               async.parallel([countQuery, retrieveQuery], function(err, results){
                   if(err){
                   // console.log("error here");
                    res.status(500).send(err);
                   }else{
                    res.status(200).json({total_pages:Math.floor(results[0]/12+1) , page: pageNumber, products: results[1]});
                   }
               });
            
         }
                 });
       });       


        //assigning category
        api.put('/assigncategory/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.category=req.body.category;
                                            product.save((err)=>{
        
                                                if(!err){
                                                    
                                                                                                           
                                                    
                                                    res.status(200).send({message:"category updated"});
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

            //assigning subcategory
        api.put('/assignsubcategory/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          
                                        product.subcategory=req.body.subcategory;
                                        product.subcategoryName=req.body.name;
                                            product.save((err)=>{
        
                                                if(!err){
                                                    
                                                                                                           
                                                    
                                                    res.status(200).send({message:"subcategory updated"});
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

            //approving link
        api.put('/togglehold/:id', (req, res) => {
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
         
                    if(login.token==req.body.token && user.userType>0){  //token matching
                        Product.findOne({_id:req.params.id},(err,product)=>{
        
                           
                                if(!err){
                                        if(product===undefined){
        
                                            res.status(400).send({message:"no such product exsist"});
                                        }else{
                                    
                                          if(product.onHold==0){
                                        product.onHold=1;
                                          }else{
                                            product.onHold=0;
                                          }
                                            product.save((err)=>{
        
                                                if(!err){
        
                                                    res.status(200).send({message:"Hold toggeled"});
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
           
  return api;
}
