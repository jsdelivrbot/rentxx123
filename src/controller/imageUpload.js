import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
export default({ config, db }) => {
  let api = Router();

aws.config.update({
    secretAccessKey: 'vaLW99gpg8sUkmGF2KT4aP1S8tMzRLBAqv0S3pf5',
    accessKeyId: 'AKIAIWCDVYX3H4ND4Q5A'
    
});


  var  s3 = new aws.S3();


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'rentophilaimages',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});


api.post('/', upload.array('profileImage',1), function (req, res, next) {
    res.send("Uploaded!");
});

  return api;
}