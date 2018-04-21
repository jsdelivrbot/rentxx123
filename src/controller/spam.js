import mongoose from 'mongoose';
import { Router } from 'express';
import Spam from '../model/spam';
import bodyParser from 'body-parser';
export default({ config, db }) => {
  let api = Router();
//adding a city
//v1/city/add
  api.post('/add', (req, res) => {
    //check password or match password
       //token matching and only admin can add
               let spam=new Spam();
               spam.gender=req.body.gender;
                spam.partId=req.body.partId;
                 spam.age=req.body.age;
                  spam.epicNumber=req.body.epicNumber;
                   spam.isVoted=req.body.isVoted;
                    spam.document=req.body.document;
               spam.save((err,spam_got)=>{

                if(!err){

                    res.status(200).send(spam_got);
                }else{
                    res.status(500).send(err);
                }
               });
                    
   });



//get cities here
    api.post('/get', (req, res) => {
      Spam.find({}, function(err, spams) {
        res.json({"spams":spams});
    });
});
  return api;
}
