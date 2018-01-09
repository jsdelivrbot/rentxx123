import { Router } from 'express';
import { multer } from 'multer';
export default({ config, db }) => {
  let api = Router();

  
const upload = multer({
    dest:'images/', 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
    
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')

api.post('/', (req, res) => {

    upload(req, res, function (err) {

        if (err) {

            res.status(400).json({message: err.message})

        } else {

            let path = `/images/${req.file.filename}`
            res.status(200).json({message: 'Image Uploaded Successfully !', path: path})
        }
    })
})

api.get('/images/:imagename', (req, res) => {

    let imagename = req.params.imagename
    let imagepath = __dirname + "/images/" + imagename
    let image = fs.readFileSync(imagepath)
    let mime = fileType(image).mime

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
})




api.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})
  return api;
}