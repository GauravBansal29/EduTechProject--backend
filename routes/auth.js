const router= require('express').Router();
import {register, login} from '../controller/auth'

const mongoose= require('mongoose');

router.post('/register', register);
// post in login also as we want to send res.body
router.post('/login',login);

module.exports= router;

