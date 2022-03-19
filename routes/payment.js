const router= require('express').Router();
import {createOrder, payOrder} from "../controller/payment"
// new payment request
router.post('/create-order',createOrder) ;
// after filling details success or abort part 
router.post('/pay-order', payOrder);
module.exports= router;