import {createRequire} from "module"
const require= createRequire(import.meta.url);
const router= require('express').Router();
import {jwtSigned} from '../middlewares/index.js'
import {markComplete, markIncomplete, completedCourses} from '../controller/completed.js'
// import { Route53RecoveryCluster } from 'aws-sdk';
router.post('/markascomplete', jwtSigned, markComplete);
router.post('/markasincomplete', jwtSigned, markIncomplete);
router.get('/completed/:course',jwtSigned, completedCourses );
export default router;

