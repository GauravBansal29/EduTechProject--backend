const router= require('express').Router();

import {jwtSigned} from '../middlewares/index'
import {addContact, addFundAccount, getRazorpayKey, createOrder, payOrder, makePayout, fetchPayment, fetchPayout} from '../controller/payment'


// controller 

//making fund_account for payments to instructors
router.post('/add-contact', jwtSigned, addContact);
router.post('/add-fundaccount', jwtSigned, addFundAccount);
router.post('/payout', jwtSigned, makePayout );

//razorpay payment routes
router.get('/get-razorpay-key', jwtSigned, getRazorpayKey);
router.post('/create-order', jwtSigned, createOrder);
router.post('/pay-order/:id', jwtSigned, payOrder);
router.get('/fetch-payment/:orderid', jwtSigned, fetchPayment);
router.get('/fetch-payout/:payoutid',jwtSigned, fetchPayout )
module.exports= router;
