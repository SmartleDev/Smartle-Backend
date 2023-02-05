import express from 'express';
import {
  getHomeEnterpriseCourses,
  getEnterpriseCourse,
  getGradeInfo,
  getGrads,
} from '../controller/enterpriseController';

const router = express.Router();

router.get('/getHomeEnterpriseCourses', getHomeEnterpriseCourses);
router.get('/getEnterpriseCourse/:courseName', getEnterpriseCourse);
router.post('/getGradeInfo', getGradeInfo);
router.get('/getGrads/:courseName', getGrads);

export default router;
