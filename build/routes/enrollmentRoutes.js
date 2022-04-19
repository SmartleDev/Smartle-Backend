"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollmentController_1 = require("../controller/enrollmentController");
const router = express_1.default.Router();
router.post("/enrolledcourses", enrollmentController_1.getLearnerCourses);
router.post("/getEnrolledCourseView", enrollmentController_1.getEnrolledCourseView);
router.post("/getinstructorlist", enrollmentController_1.getInstructorList);
router.post("/getcourseandinstructordetails", enrollmentController_1.getCourseAndInstructorDetails);
router.post("/getsessionview", enrollmentController_1.getSessionView);
router.post("/enrollLearner", enrollmentController_1.enrollLearner);
router.post("/getenrolledsessiondetails", enrollmentController_1.getEnrolledSessionDetails);
router.post("/verifyUserEnrollment", enrollmentController_1.verifyUserEnrollment);
exports.default = router;
