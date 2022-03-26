import express from 'express';
import {getModuleforCourse} from '../controller/coursesController';

const router = express.Router();

router.get("/modules/:id", getModuleforCourse);

export default router;