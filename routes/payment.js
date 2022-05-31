const router= require('express').Router();

import {jwtSigned} from '../middlewares/index'
import {addContact, addFundAccount} from '../controller/payment'


// controller 
router.post('/add-contact', jwtSigned, addContact);
router.post('/add-fundaccount', jwtSigned, addFundAccount);


module.exports= router;
