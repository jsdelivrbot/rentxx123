import mongoose from 'mongoose';
import { Router } from 'express';
import Spam from '../model/spam';
import bodyParser from 'body-parser';
import Pusher from 'pusher';
export default({ config, db }) => {
  let api = Router();
//adding a city
//v1/city/add
let pusher = new Pusher({
  appId: '513442',
  key: 'dd20d8a12a2c4b1c7960',
  secret: 'fde09d5acecffcb9f07d',
  cluster: 'ap2',
  encrypted: true
});
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
pusher.trigger('os-poll', 'os-vote', {
                     gender:req.body.gender,
                     partId:req.body.partId,
                     age:req.body.age,
                     isVoted:req.body.isVoted,
                     document:req.body.document
});
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
