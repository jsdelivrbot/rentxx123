import { Router } from 'express';
import { multer } from 'multer';
export default({ config, db }) => {
  let api = Router();

  
var upload = multer({ storage: storage }).single('profileImage');

api.post('/',upload.single('profileimage') ,(req, res) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});



    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
        }
        res.json({
            success: true,
            message: 'Image uploaded!'
        });

        // Everything went fine
    })
});
  return api;
}