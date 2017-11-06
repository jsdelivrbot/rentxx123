import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Requests from '../model/requests';
import User from '../model/user';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();

  // '/v1/requests/add/emailID'
  api.post('/add/:email', (req, res) => {
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

            if(login.token==req.body.token){  //password matching
               
                    let newRequest=new Requests();
                    newRequest.requestName=req.body.requestName;
                   // newRequest.image=req.body.name; saved for later
                    newRequest.numberOfDays=req.body.numberOfDays;
                    newRequest.description=req.body.description;
                    newRequest.referenceLink=req.body.referenceLink;
                    newRequest.college=user.college;
                    newRequest.userId=user._id
                    newRequest.save((err,request)=>{

                        if(!err){
                                res.status(200).json(request);

                        }else{

                                res.status(400).json({message:"request not saved!"});
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

  //updating a request

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
 
             if(login.token==req.body.token){  //password matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                               console.log(user._id);
                               console.log(request.userId);
                                    if(user._id.equals(request.userId) || login.userType>0){
                                    request.requestName=req.body.requestName;
                                    request.numberOfDays=req.body.numberOfDays;
                                    request.description=req.body.description;
                                    request.referenceLink=req.body.referenceLink;
                                    request.save((err,request)=>{

                                        if(!err){

                                            res.status(200).send(request);
                                        }else{

                                            res.status(400).send({message:"request was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to update request"});
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
 //deleting a request
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
 
             if(login.token==req.body.token){  //password matching
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                               console.log(user._id);
                               console.log(request.userId);
                                    if(user._id.equals(request.userId) || login.userType>0){
                                
                                    request.remove((err)=>{

                                        if(!err){

                                            res.status(200).send({message:"request deleted successsfully!"});
                                        }else{

                                            res.status(400).send({message:"request was not saved"});
                                        }
                                    
                                    });

                                }else{
                                    
                                      res.status(400).send({message:"not authorized to delete request"});
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
