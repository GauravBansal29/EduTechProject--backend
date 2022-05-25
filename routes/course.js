const router= require('express').Router();
import {imageUpload, createCourse, removeImage} from '../controller/course'
import {isInstructor, jwtSigned} from '../middlewares/index'
// course image S3 upload and delete functions
router.post('/image-upload', jwtSigned, imageUpload);
router.delete('/image-delete',jwtSigned, removeImage);
// create course function 
router.post('/create-course', jwtSigned ,isInstructor, createCourse); 

module.exports= router;

