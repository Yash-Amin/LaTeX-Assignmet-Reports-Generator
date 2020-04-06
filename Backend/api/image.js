var multer = require('multer');
const router = require('express').Router();

const uuidv4 = require('uuid/v4');
const auth = require('./authMiddleware');
const db = require('../db');
const sequelize = require('sequelize');
const path = require('path');

const imageModel = require('../models/images')(db, sequelize);
var imageUploadPath = path.join(__dirname, '../Images');

router.use(require('body-parser').urlencoded({ extended: true }));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, imageUploadPath);
    },
    filename: function(req, file, callback) {
        let filename = uuidv4() + '.jpg';
        // req.body.file = filename;
        // console.log('file')
        console.log(file);

        callback(null, filename);
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single('ss');

router.post('/', auth, function(req, res) {
    console.log('------');
    console.log(req.files); 
    console.log(req.file);
    upload(req, res, function(err, filename) {
        
        console.log('[+] Upload');
        console.log(req.file)
        console.log(req.files)
        // console.log('Request ---');
        // console.log(req.body);
        // console.log('Request file ---'); //Here you get file.
        // console.log(req.file);
        if (err || !req.file) {
            console.log(err);
            return res.status(400).json(Error('ImageUploadError'));
        }  else {
            console.log(filename);
            console.log(req.file);
            const obj = {
                uuid: req.file.filename.slice(0, -4), //remove extension
                userid: req.user.id
            };

            imageModel
                .create(obj)
                .then(() => {
                    console.log('Uploaded!', obj);
                    res.json({ filename: req.file.filename.slice(0, -4) });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(Error('ImageUploadError'));
                });
        }
    });
});

function checkPrefix(prefix, candidate) {
    var absPrefix = path.resolve(prefix) + path.sep;
    var absCandidate = path.resolve(candidate) + path.sep;
    return absCandidate.substring(0, absPrefix.length) === absPrefix;
}

router.get('/:imageid', function(req, res) {
    const { id, imageid } = req.params;
    imageModel
        .findOne({ where: { uuid: imageid, userid: req.user.id }, raw: true })
        .then(data => {
            if (!data) {
                return res.status(404).json(Error('No image found!'));
            }

            var imgPath = path.resolve(
                path.join(__dirname, '../Images/', data.uuid + '.jpg')
            );
            if (checkPrefix(imageUploadPath, imgPath)) {
                res.sendFile(imgPath);
            } else {
                return res.status(400).json(Error('hmm.'));
            }
        })
        .catch(err => {
            console.log(err);
            res.status(404).json(Error('No image found'));
        });
});
module.exports = router;
