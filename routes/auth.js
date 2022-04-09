const router= require('express').Router();
import {register, login, logout ,currentUser, sendTestEmail, generateOtp} from '../controller/auth'
import {jwtSigned} from '../middlewares/index'


// controller 
router.post('/register', register);
// post in login also as we want to send res.body
router.post('/login',login);
//verify for corect email and send otp  to email and redirect user to enter it on successful response of api
router.post('/generate-otp',generateOtp);
// logout functionality for clearing the http cookie for jwt
router.get('/logout', logout);
//whenever you want to access a protected route you need to verify JWT token then you can get the user
router.get('/current-user',jwtSigned , currentUser);
router.get('/send-test-email',sendTestEmail );

module.exports= router;

