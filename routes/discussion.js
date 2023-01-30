import {createRequire} from "module"
const require= createRequire(import.meta.url);
const router= require('express').Router();
import {jwtSigned} from '../middlewares/index.js'
import {addDiscussion, getLessonDiscussion} from '../controller/discussion.js'
router.get('/course-discussions/:courseid',jwtSigned , getLessonDiscussion);
router.post('/adddiscussion', jwtSigned,addDiscussion );
export default router;

