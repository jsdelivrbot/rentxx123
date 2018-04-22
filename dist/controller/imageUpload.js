'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _multerS = require('multer-s3');

var _multerS2 = _interopRequireDefault(_multerS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    _awsSdk2.default.config.update({
        secretAccessKey: 'XGNpMC1dwlbP0AOaYPbTc5+3ghnwqd5GgYnV4snB',
        accessKeyId: 'AKIAJ46V3SLDKEFSFLZA',
        region: 'sa-east-1'
    });

    var s3 = new _awsSdk2.default.S3();

    var upload = (0, _multer2.default)({
        storage: (0, _multerS2.default)({
            s3: s3,
            bucket: 'rentophilaimages',
            key: function key(req, file, cb) {
                console.log(file);
                cb(null, Date.now() + "_" + file.originalname); //use Date.now() for unique file keys
            }
        })
    });

    api.post('/', upload.any(), function (req, res) {
        console.log(req.files);
        res.send(req.files[0].key);
    });
    api.post('/delete', function (req, res) {
        var params = {
            Bucket: 'rentophilaimages',
            Delete: {
                Objects: [{
                    Key: req.body.key
                }]
            }

        };
        s3.deleteObjects(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                return next(err);
            }
            console.log(data);
            res.end('done');
        });
    });

    return api;
};
//# sourceMappingURL=imageUpload.js.map