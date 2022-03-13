import express from 'express';
import {getAllCourses, getAllCoursesOnHome, getModuleforCourse, getCourseView} from '../controller/coursesController';

const router = express.Router();

router.get("/course", getAllCourses);
router.get("/coursesonhome", getAllCoursesOnHome);
router.get("/getmoduleforcourse/:id", getModuleforCourse);
router.get("/getcourseview/:id", getCourseView);

export default router;