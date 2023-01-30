import {createRequire} from "module"
const require= createRequire(import.meta.url);
const router= require('express').Router();
import {register, login, logout ,currentUser, sendTestEmail, generateOtp, verifyOtp, changePassword, getUser, updateUser} from '../controller/auth.js'
import {jwtSigned} from '../middlewares/index.js'


// controller 
router.post('/register', register);
// post in login also as we want to send res.body
router.post('/login',login);
//verify for corect email and send otp  to email and redirect user to enter it on successful response of api
router.post('/generate-otp',generateOtp);
router.post('/verify-otp', verifyOtp);
router.post('/change-password', changePassword);
// logout functionality for clearing the http cookie for jwt
router.get('/logout', logout);
//whenever you want to access a protected route you need to verify JWT token then you can get the user
router.get('/current-user',jwtSigned , currentUser);
router.get('/send-test-email',sendTestEmail );
// update context 
router.get('/get-userdata', jwtSigned, getUser);
// update user details
router.post('/update-user', jwtSigned, updateUser);
export default router;

