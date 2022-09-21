import express from 'express';
import {getHomeEnterpriseCourses} from '../controller/enterpriseController';

const router = express.Router();

router.get("/getHomeEnterpriseCourses", getHomeEnterpriseCourses);

export default router;