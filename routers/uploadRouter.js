const express = require('express');
const authenticate = require('../authenticate')
const uploadRouter = express.Router();
const multer = require('multer');
const cors= require('./cors');
uploadRouter.use(express.json());

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null,'public/images');
    },
    filename: (req, file, cb)=> {
        cb(null,file.originalname)
    }
})
const imageFileFilter = (req, file, cb)=> {
    if(!file.originalname.match(/\.(png|jpg|jpeg|gif)$/)){
        cb(new Error('you can upload only images Files'));
    }
    cb(null, true)
}
const upload = multer({
    storage: storage,
    fileFilter:imageFileFilter,
})

uploadRouter.route('/')
.options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser,authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload ');
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, upload.single('imageFile'),(req, res) => {
    res.status(200).json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload ');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload ');
})


module.exports = uploadRouter;