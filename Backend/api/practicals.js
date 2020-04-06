const router = require('express').Router();
const config = require('../config')
const uuidv4 = require('uuid/v4');

var bodyparser = require('body-parser').json();
router.use(bodyparser);

const auth = require('./authMiddleware');
const Error = require('./error');
const latex = require('./latexApi');
const process = require('child_process');

const fs = require('fs');
var mkdirp = require('mkdirp');
const path = require('path');
const db = require('../db');
const sequelize = require('sequelize');
const Practicals = require('../models/practicals')(db, sequelize);

var imageUploadPath = path.join(__dirname, '../Images');
console.log('Image upload: ', imageUploadPath, uuidv4());

// ---------------------------------------------------------------------------------------------------
function write(path, data, callback) {
    fs.writeFile(path, JSON.stringify(data), callback);
}
function writeRaw(path, data, callback) {
    fs.writeFile(path, data, callback);
}

function read(path, callback) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
            callback(err);
        } else {
            var obj = JSON.parse(data);
            callback(false, obj);
        }
    });
}

router.get('/', function(req, res) {
    Practicals.findAll({ raw: true })
        .then(data => {
            res.json({ data });
        })
        .catch(err => {
            res.json(Error('Server Error'));
        });
});

function getPractical(id, callback) {
    Practicals.findOne({ where: { id }, raw: true })
        .then(data => {
            if (!data) {
                return callback(true);
            }
            callback(false, data);
        })
        .catch(err => {
            callback(true);
        });
}

function getUploadPath(user, practical, makedir, callback) {
    var dirPath = path.join(
        __dirname,
        '../',
        'uploads',
        String(user),
        practical
    );

    if (makedir) {
        mkdirp(dirPath, function(err) {
            if (err) {
                console.log(err);
            }
            if (callback) callback(err, dirPath);
        });
    } else {
        return dirPath;
    }
}

// var storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, imageUploadPath);
//     },
//     filename: function(req, file, callback) {
//         let filename = uuidv4() + '.jpg';
//         // req.body.file = filename;
//         // console.log('file')
//         console.log(file);

//         callback(null, filename);
//     }
// });

// var upload = multer({
//     storage: storage,
//     limits: { fileSize: 10000000 }
// }).single('file');

// router.post('/:id/image/upload', auth, function(req, res) {
//     console.log('------');
//     console.log(req.body);

//     upload(req, res, function(err, filename) {
//         console.log('[+] Upload');
//         // console.log('Request ---');
//         // console.log(req.body);
//         // console.log('Request file ---'); //Here you get file.
//         // console.log(req.file);
//         if (err) {
//             console.log(err);
//             return res.status(400).json(Error('ImageUploadError'));
//         } else {
//             console.log(filename);
//             console.log(req.file);
//             const obj = {
//                 uuid: req.file.filename.slice(0, -4), //remove extension
//                 userid: req.user.id
//             };

//             imageModel
//                 .create(obj)
//                 .then(() => {
//                     console.log('Uploaded!', obj);
//                     res.json({ filename: req.file.filename.slice(0, -4) });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     res.status(400).json(Error('ImageUploadError'));
//                 });
//         }
//     });
// });

// function checkPrefix(prefix, candidate) {
//     var absPrefix = path.resolve(prefix) + path.sep;
//     var absCandidate = path.resolve(candidate) + path.sep;
//     return absCandidate.substring(0, absPrefix.length) === absPrefix;
// }

// router.get('/:id/image/:imageid', function(req, res) {
//     const { id, imageid } = req.params;
//     imageModel
//         .findOne({ where: { uuid: imageid, userid: req.user.id }, raw: true })
//         .then(data => {
//             if (!data) {
//                 return res.status(404).json(Error('No image found!'));
//             }

//             var imgPath = path.resolve(
//                 path.join(__dirname, '../Images/', data.uuid + '.jpg')
//             );
//             if (checkPrefix(imageUploadPath, imgPath)) {
//                 res.sendFile(imgPath);
//             } else {
//                 return res.status(400).json(Error('hmm.'));
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(404).json(Error('No image found'));
//         });
// });

router.post('/:id/:operation', auth, function(req, res) {
    if (req.body === {}) {
        return res.json(Error('Empty request.'));
    }
    const operation = String(req.params.operation).toLowerCase();
    console.log('>> Operation', operation);
    if (
        [
            'details',
            'theory',
            'code',
            'output',
            'questions',
            'reference'
        ].indexOf(operation) < 0
    ) {
        res.statusMessage = '404Bitch';
        return res.status(404).end('404 :(');
    }

    getPractical(req.params.id, function(err, data) {
        console.log('get practical, ', req.params.id, data);
        if (err) {
            console.log(err);
            return res.status(400).json(Error('Server ErRoR!'));
        }
        getUploadPath(req.user.id, data.name, true, function(err, dirPath) {
            console.log('get upload');
            if (err) {
                console.log(err);
                return res.status(400).json(Error('Server ErRoR!'));
            }
            try {
                req.body.practicalID = '' + req.params.id;
            } catch (err) {}
            write(dirPath + '/' + operation + '.json', req.body, function(err) {
                console.log('write');
                if (err) {
                    console.log(err);
                    return res.status(400).json(Error('Server ErRoR!'));
                }
                res.json(Error());
            });
        });
    });
});

function sendLatex(req, res) {
    var practicalID = req.params.id;
    if (isNaN(practicalID)) {
        return res.status(404).json(Error('Invalid Practical number!'));
    }

    var dirPath = path.join(
        __dirname,
        '../uploads/',
        String(req.user.id),
        'Practical-' + practicalID
    );

    latex.createLatex(
        dirPath,
        function(doc) {
            res.send(String(doc).replace('\n', '\r\n'));
        },
        true
    );
}

router.get('/:id/pdf/preview', auth, function(req, res) {
    var practicalID = req.params.id;
    if (isNaN(practicalID)) {
        return res.status(404).json(Error('Invalid Practical number!'));
    }

    var dirPath = path.join(
        __dirname,
        '../uploads/',
        String(req.user.id),
        'Practical-' + practicalID
    );

    var docPath = path.join(dirPath, 'main.tex');
    latex.createLatex(dirPath, function(doc) {
        if (!doc || doc === '')
            return res
                .status(400)
                .json(Error('Error while creating latex file'));
        writeRaw(docPath, doc, err => {
            if (err) {
                console.log('[+] Error!');
                return res
                    .status(400)
                    .json(Error('Error while saving latex file'));
            }

            var cmd = 'pdflatex'; //+ +(+practicalID);
            var args = [
                '-enable-mltex',
                '-interaction=nonstopmode',
                '-aux-directory=' +
                    '.\\uploads\\' +
                    req.user.id +
                    '\\Practical-' +
                    practicalID,
                '-output-directory=' +
                    '.\\uploads\\' +
                    req.user.id +
                    '\\Practical-' +
                    practicalID,
                '-include-directory="' + config.latexPackagesDirectory + '"',
                '.\\uploads\\' +
                    req.user.id +
                    '\\Practical-' +
                    practicalID +
                    '\\main.tex'
            ];
            console.log(cmd + ' ' + args.join(' '));
            var latexProc = process.spawn(
                cmd,
                args
                // {
                //     cwd: path.resolve(
                //         '..\\uploads\\' + req.user.id + '\\Practical-' + practicalID
                //     )
                // }
            );
            console.log('[+] Exec cmd:', cmd, args.join(' '));
            latexProc.stdout.on('data', function(data) {
                // console.log('DATA:  ' +data.toString())
            });
            latexProc.stderr.on('data', function(data) {
                // console.log(data.toString())
            });
            latexProc.on('message', function(data) {
                // console.log('[+] Data!', data);
                latexProc.stdin.write('\r\n\r\n');
            });

            latexProc.on('close', function(code) {
                console.log('[+] Closed!');
                res.sendFile(path.join(dirPath, 'main.pdf'));
            });
        });
    });
});

router.get('/:id/:operation', auth, function(req, res) {
    // if (req.body === {}) {
    //     return res.json(Error('Empty request.'));
    // }
    const operation = String(req.params.operation).toLowerCase();

    if (
        [
            'details',
            'theory',
            'code',
            'questions',
            'output',
            'latex',
            'reference'
        ].indexOf(operation) < 0
    ) {
        res.statusMessage = "404'--";
        return res.status(404).end('404 :(');
    }

    getPractical(req.params.id, function(err, data) {
        if (err) {
            return res.status(404).json(Error('Server ErRoR!'));
        }
        getUploadPath(req.user.id, data.name, true, function(err, dirPath) {
            if (err) {
                return res.status(404).json(Error('Server ErRoR!'));
            }
            if (operation === 'latex') {
                sendLatex(req, res);
            } else {
                read(dirPath + '/' + operation + '.json', function(err, data) {
                    if (err) {
                        return res.status(404).json(Error('Server ErRoR!'));
                    }
                    res.json(data);
                });
            }
        });
    });
});

module.exports = router;
