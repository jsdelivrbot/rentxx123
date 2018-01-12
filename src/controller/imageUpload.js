import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
export default({ config, db }) => {
  let api = Router();

aws.config.update({
    secretAccessKey: 'XGNpMC1dwlbP0AOaYPbTc5+3ghnwqd5GgYnV4snB',
    accessKeyId: 'AKIAJ46V3SLDKEFSFLZA',
     region: 'sa-east-1'
});


  var  s3 = new aws.S3();


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'rentophilaimages',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now()+"_"+file.originalname); //use Date.now() for unique file keys
        }
    })
});


api.post('/', upload.any(), function (req, res, next) {
    console.log(req.files);
    res.json({loaction:req.files[0].location});
});

  return api;
}