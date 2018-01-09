import { Router } from 'express';
import * as multer from 'multer';
export default({ config, db }) => {
  let api = Router();

  const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});
api.post('/', upload.single('profileImage'), (req, res, next) => {
});

api.post('/photos/upload', upload.array('photos', 12), (req, res, next) => {
});

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);
api.post('/cool-profile', cpUpload, (req, res, next) => {
});

const diskStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '/uploads');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}`);
    }
});

const diskUpload = multer({ storage: diskStorage });

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });
  return api;
}