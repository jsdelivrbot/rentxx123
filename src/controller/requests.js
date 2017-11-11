import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import Requests from '../model/requests';
import User from '../model/user';
import bodyParser from 'body-parser';
import Notification from '../model/notification';
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
                    newRequest.lastEdit=Date();
                    newRequest.save((err,request)=>{

                        if(!err){
                            let newNotification=new Notification();
                            newNotification.userId=user._id;
                            newNotification.message="Status Pending!"
                            newNotification.description="You Request "+request.requestName+" is peding on approval by moderators will get back to you soon!";
                            newNotification.type=4;
                            newNotification.refId=request._id;
                            newNotification.link="/requests";
                            newNotification.save();
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
                                    request.lastEdit=Date();
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
   //------------------------------------------------------------------------
   //aaproval starts here!
   //approving request
   api.put('/approverequest/:id', (req, res) => {
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
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                            
                                  
                                request.requestApproved=1;
                                    request.save((err)=>{

                                        if(!err){
                                            let newNotification=new Notification();
                                            newNotification.userId=request.userId;
                                            newNotification.message="Request Approved!"
                                            newNotification.description=req.body.description;
                                            newNotification.type=1;
                                            newNotification.refId=request._id;
                                            newNotification.link="/requests";
                                            newNotification.save();
                                            res.status(200).send({message:"request approved!"});
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
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.linkApproved=1;
                                        request.save((err)=>{
    
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
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.imageApproved=1;
                                        request.save((err)=>{
    
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
        //rejecting request
   api.put('/rejectrequest/:id', (req, res) => {
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
                Requests.findOne({_id:req.params.id},(err,request)=>{

                   
                        if(!err){
                                if(request===undefined){

                                    res.status(400).send({message:"no such request exsist"});
                                }else{
                            
                                  
                                request.requestApproved=2;
                                    request.save((err)=>{

                                        if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="request Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
                                                newNotification.save();
                                            res.status(200).send({message:"Request rejected!"});
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
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.linkApproved=2;
                                        request.save((err)=>{
    
                                            if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="Link Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
                                                newNotification.save();
                                                res.status(200).send({message:"Link  rejected!"});
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
                    Requests.findOne({_id:req.params.id},(err,request)=>{
    
                       
                            if(!err){
                                    if(request===undefined){
    
                                        res.status(400).send({message:"no such request exsist"});
                                    }else{
                                
                                      
                                    request.imageApproved=2;
                                        request.save((err)=>{
    
                                            if(!err){
                                                let newNotification=new Notification();
                                                newNotification.userId=request.userId;
                                                newNotification.message="Images Rejected!"
                                                newNotification.description=req.body.description;
                                                newNotification.type=1;
                                                newNotification.refId=request._id;
                                                newNotification.link="/requests";
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
  return api;
}
