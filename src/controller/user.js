import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import bodyParser from 'body-parser';

export default({ config, db }) => {
  let api = Router();

  // '/v1/user/add'
  api.post('/add', (req, res) => {
    console.log("hello "+req.body.fname);
    let newUser = new User();
    newUser.fname = req.body.fname;
    newUser.lname = req.body.lname;
    newUser.email = req.body.email;
    newUser.password=req.body.password;
    newUser.save(function(err) {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          return res.status(500).send({ succes: false, message: 'User already exist!' });
        }
  
        // Some other error
        return res.status(500).send(err);
      }
      res.json({ message: 'User saved successfully' });
    });
  });
  //finding all users
  api.get('/',(req,res)=>{
User.find({},(err,results)=>{

  if(err){

    res.send(err);

        }
  res.json(results);
    });

       });

       //find a user by email
       api.get('/:email',(req,res)=>{
        User.find({email:req.params.email},(err,results)=>{
        
          if(err){
        
            res.send(err);
        
                }
          res.json(results);
            });
        
               });
       //updating user
       api.put('/update/:email',(req,res)=>{
        User.findOne({email: req.params.email}, function(err, user) {
          if(!err) {
            if(user===null){
              res.json({ message: 'User not found!' });
  
            }else{
              user.fname=req.body.fname;
              user.lname=req.body.lname;
              user.save(function(err) {
                  if(err){

                    res.send(err);
                  }
                  res.json({ message: 'User updated successfully' });
                  
              });
            }
          }else{

            res.send(err);
          }
      });
    });
    api.delete('/delete/:email',(req,res)=>{
      User.findOne({email: req.params.email}, function(err, user) {
        if(!err) {
          if(user===null){
            res.json({ message: 'User not found!' });

          }else{
            user.remove(function(err) {
                if(err){

                  res.send(err);
                }
                res.json({ message: 'User deleted successfully' });
                
            });
          }
        }else{

          res.send(err);
        }
    });

    })
  return api;
}
