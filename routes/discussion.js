const router= require('express').Router();
import {jwtSigned} from '../middlewares/index'
import {addDiscussion, getLessonDiscussion} from '../controller/discussion'
router.get('/course-discussions/:courseid',jwtSigned , getLessonDiscussion);
router.post('/adddiscussion', jwtSigned,addDiscussion );
module.exports= router;

