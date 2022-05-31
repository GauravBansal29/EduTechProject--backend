const router= require('express').Router();

import {jwtSigned} from '../middlewares/index'
import {addContact, addFundAccount, getRazorpayKey, createOrder, payOrder} from '../controller/payment'


// controller 

//making fund_account for payments to instructors
router.post('/add-contact', jwtSigned, addContact);
router.post('/add-fundaccount', jwtSigned, addFundAccount);

//razorpay payment routes
router.get('/get-razorpay-key', jwtSigned, getRazorpayKey);
router.post('/create-order', jwtSigned, createOrder);
router.post('/pay-order', jwtSigned, payOrder);
module.exports= router;
