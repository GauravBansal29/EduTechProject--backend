import formidable from "express-formidable"
const router= require('express').Router();
import {imageUpload, createCourse, removeImage, getCourse, videoUpload, videoDelete, addLesson, updateCourse, updateCourseLessons, deleteLesson} from '../controller/course'
import {isInstructor, jwtSigned} from '../middlewares/index'
// course image S3 upload and delete functions
router.post('/image-upload', jwtSigned, imageUpload);
router.post('/image-delete',jwtSigned, removeImage);
// create course function 
router.post('/create-course', jwtSigned ,isInstructor, createCourse); 
// update course function
router.put('/update-course/:slug', jwtSigned, isInstructor, updateCourse);
// update course lesson function
router.put('/update-course-lessons/:slug', jwtSigned, isInstructor, updateCourseLessons);
// get course details for the instructor
router.get('/course/:slug', jwtSigned, isInstructor, getCourse);
// video upload for lessons 
router.post('/course/video-upload', jwtSigned, isInstructor,formidable(), videoUpload);
//video delete 
router.post('/course/remove-video', jwtSigned, isInstructor, videoDelete);
// add lessons to course
router.post('/course/lesson/:slug', jwtSigned, isInstructor, addLesson);
//delete lesson
router.delete('/delete-lesson/:id', jwtSigned, isInstructor, deleteLesson);
module.exports= router;

