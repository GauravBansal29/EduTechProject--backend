const router= require('express').Router();
import {jwtSigned} from '../middlewares/index'
import {markComplete, markIncomplete, completedCourses} from '../controller/completed'
import { Route53RecoveryCluster } from 'aws-sdk';
router.post('/markascomplete', jwtSigned, markComplete);
router.post('/markasincomplete', jwtSigned, markIncomplete);
router.get('/completed/:course',jwtSigned, completedCourses );
module.exports= router;

