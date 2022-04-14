const router= require('express').Router();
import {imageUpload, createCourse} from '../controller/course'
import {jwtSigned} from '../middlewares/index'

router.post('/image-upload', jwtSigned, imageUpload);
router.post('/create-course', jwtSigned , createCourse);
module.exports= router;

