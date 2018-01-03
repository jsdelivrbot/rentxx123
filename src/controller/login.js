import mongoose from 'mongoose';
import { Router } from 'express';
import Login from '../model/login';
import User from '../model/user';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
export default({ config, db }) => {
  let api = Router();

  // '/v1/login/add'
  api.post('/add', (req, res) => {
   //check password or match password
User.findOne({email:req.body.email},(err,user)=>{

    if(!err){

        if(user==undefined){ //user not found

            res.status(400).json({ message: 'User not found!' });
        }else{

            if(user.password===req.body.password){  //password matching
               if(user.emailverified==1){
        //checking if user is already logged in
        Login.findOne({email:req.body.email},(err,loginDetails)=>{

            if(!err){
                if(loginDetails===null){ //user is not already logged in
                        //saving login new details
                    let newLogin=new Login();
                    newLogin.email=req.body.email;
                    newLogin.userType=user.userType;
                    newLogin.save((err,loginDetailsAfterSaving)=>{

                        if(err){

                            res.status(500).send(err);
                        }
                        user.toJSON().token=loginDetailsAfterSaving.token;
                    
                        let token=jsonwebtoken.sign(user.toJSON(),"example1");   
                        res.status(200).json({token:token});
                    });

                }else{  //user is already logged in
                     user.token=loginDetails.token;
                       let token=jsonwebtoken.sign(user.toJSON(),"example1");
                    res.status(200).json({token:token});

                }

            }else{

                res.status(500).send(err);
            }
        

        });
    }else{
        res.status(400).json({ message: 'user not verified!' });

    }
            }else{
                res.status(400).json({ message: 'invalid password!' });

            }

        }
    }
});
  });
  //logging out a user
    api.delete('/logout/:email',(req,res)=>{
      Login.findOne({email: req.params.email}, function(err, login) {
        if(!err) {
          if(login===null){
            res.status(400).json({ message: 'User not found!' });

          }else{
              if(login.token===req.body.token){
            login.remove(function(err) {
                if(err){

                  res.send(err);
                }
                res.status(200).json({ message: 'User logged out successfully' });
                
            });
        }else{
            res.status(400).json({ message: 'Wrong token' });

        }
          }
        }else{

          res.status(500).send(err);
        }
    });

    })
  return api;
}
