import express from "express";
import {
  getAllCourses,
  getAllCoursesOnHome,
  getModuleforCourse,
  getCourseView,
  getTopicforModule,
  getModuleView,
  getRecommendedCourses,
  getCourseGeneralView,
  getCourseDetailsHome,
  registerIntrest
} from "../controller/coursesController";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/coursesonhome", getAllCoursesOnHome);
router.get("/getmoduleforcourse/:id", getModuleforCourse);
router.get("/getcourseview/:id", getCourseView);
router.get("/getcoursegeneralview/:id", getCourseGeneralView);
router.post("/getCourseDetailsHome", getCourseDetailsHome);
router.get("/gettopicformodule/:id", getTopicforModule);
router.get("/getModuleView/:id", getModuleView);
router.post("/getRecommendedCourses", getRecommendedCourses);
router.post("/registerIntrest", registerIntrest);

export default router;
