import express from 'express';
import {
  getHomeEnterpriseCourses,
  getEnterpriseCourse,
} from '../controller/enterpriseController';

const router = express.Router();

router.get('/getHomeEnterpriseCourses', getHomeEnterpriseCourses);
router.get('/getEnterpriseCourse/:courseName', getEnterpriseCourse);

export default router;
