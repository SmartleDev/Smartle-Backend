import express from "express";
import {
  getAllCourses,
  getAllCoursesOnHome,
  getModuleforCourse,
  getCourseView,
  getTopicforModule,
  getModuleView,
  getRecommendedCourses,
} from "../controller/coursesController";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/coursesonhome", getAllCoursesOnHome);
router.get("/getmoduleforcourse/:id", getModuleforCourse);
router.get("/getcourseview/:id", getCourseView);
router.get("/gettopicformodule/:id", getTopicforModule);
router.get("/getModuleView/:id", getModuleView);
router.post("/getRecommendedCourses", getRecommendedCourses);

export default router;
