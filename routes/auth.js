const router= require('express').Router();
import {register, login, logout } from '../controller/auth'

const mongoose= require('mongoose');

router.post('/register', register);
// post in login also as we want to send res.body
router.post('/login',login);
// logout functionality for clearing the http cookie for jwt
router.get('/logout', logout);
module.exports= router;

