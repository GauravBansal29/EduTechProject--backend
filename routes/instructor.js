// all instructor related routes
import { jwtSigned } from '../middlewares/index'
import { makeInstructor, getAccountStatus, currentInstructor } from '../controller/instructor';
const router = require("express").Router();
// making instructor for stripe callback
router.post('/makeinstructor',jwtSigned, makeInstructor);
// make instructor on response success and charges enabled
router.post('/get-account-status', jwtSigned , getAccountStatus);
//open routes if the person has instructor roles
router.get('/current-instructor', jwtSigned, currentInstructor);
module.exports = router;
