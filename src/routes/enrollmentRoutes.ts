import express from "express";
import {
  getLearnerCourses,
  getEnrolledCourseView,
  getInstructorList,
  getInstructorDetails,
  getSessionView,
  enrollLearner,
  getEnrolledSessionDetails,
  verifyUserEnrollment,
  convertTrialToBuyCourse,
  updateSessionAvaliablity,
  getTopicContent,
} from "../controller/enrollmentController";

const router = express.Router();

router.post("/enrolledcourses", getLearnerCourses);
router.post("/getEnrolledCourseView", getEnrolledCourseView);
router.post("/getinstructorlist", getInstructorList);
router.get("/getInstructorDetails/:id", getInstructorDetails);
router.post("/getsessionview", getSessionView);
router.post("/enrollLearner", enrollLearner);
router.post("/getenrolledsessiondetails", getEnrolledSessionDetails);
router.post("/verifyUserEnrollment", verifyUserEnrollment);
router.post("/convertTrialToBuyCourse", convertTrialToBuyCourse);
router.post("/updateSessionAvaliablity", updateSessionAvaliablity);
router.get("/getTopicContent/:id", getTopicContent);

export default router;
