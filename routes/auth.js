const router= require('express').Router();
import {register, login, logout ,currentUser} from '../controller/auth'
import {jwtSigned} from '../middlewares/index'


// controller 
router.post('/register', register);
// post in login also as we want to send res.body
router.post('/login',login);
// logout functionality for clearing the http cookie for jwt
router.get('/logout', logout);
//whenever you want to access a protected route you need to verify JWT token then you can get the user
router.get('/current-user',jwtSigned , currentUser);
module.exports= router;

