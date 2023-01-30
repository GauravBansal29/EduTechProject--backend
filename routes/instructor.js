import {createRequire} from "module"
const require= createRequire(import.meta.url);
// all instructor related routes
import { jwtSigned, isInstructor } from '../middlewares/index.js'
import { makeInstructor, getAccountStatus, currentInstructor, instructorCourses } from '../controller/instructor.js';
const router = require("express").Router();
// making instructor for stripe callback
router.post('/makeinstructor',jwtSigned, makeInstructor);
// make instructor on response success and charges enabled
router.post('/get-account-status', jwtSigned , getAccountStatus);
//open routes in frontend if the person has instructor roles
router.get('/current-instructor', jwtSigned, currentInstructor);
// get all courses to display in the instructor dashboard 
router.get('/instructor-courses',jwtSigned, isInstructor, instructorCourses);
export default router;
