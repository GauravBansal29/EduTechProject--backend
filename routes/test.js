import { createRequire } from 'module'
const require = createRequire(import.meta.url);

import { getKey, getOrder, paymentOrder} from 'mern_pay'

const router= require('express').Router();

router.get('/get-key', getKey);
router.post('/get-order', getOrder);
router.post('/payment-order', paymentOrder);

module.exports= router;
