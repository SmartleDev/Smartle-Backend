import express from 'express';
import {
  getProgressCourseModule,
  getProgressModuleTopic,
  getTrackedCourse,
  updateTopicStatus,
  updateModuleStatus,
  updateModuleCompeletedStatus,
  enrolledUserProgressDefault,
  updateTopicsCompleted,
  getAllTopicsCompleted,
  courseProgressTopic,
  courseModulesRemaining,
  courseModulesDone,
  updateModuleCompeletedArray,
  getDoneModulesID,
  getModuleTopicIdList,
} from '../controller/courseProgressController';

const router = express.Router();

router.get('/getProgressCourseModule/:id', getProgressCourseModule);
router.get('/getProgressModuleTopic/:id', getProgressModuleTopic);
router.get('/getTrackedCourse/:id', getTrackedCourse);
router.post('/updateTopicStatus', updateTopicStatus);
router.post('/updateModuleStatus', updateModuleStatus);
router.post('/updateModuleCompeletedStatus', updateModuleCompeletedStatus);
router.post('/enrolledUserProgressDefault', enrolledUserProgressDefault);
router.post('/updateTopicsCompleted', updateTopicsCompleted);
router.get('/getAllTopicsCompleted/:id', getAllTopicsCompleted);
router.post('/courseProgressTopic', courseProgressTopic);
router.post('/courseModulesRemaining', courseModulesRemaining);
router.post('/courseModulesDone', courseModulesDone);
router.post('/updateModuleCompeletedArray', updateModuleCompeletedArray);
router.post('/getDoneModulesID', getDoneModulesID);
router.post('/getModuleTopicIdList', getModuleTopicIdList);

export default router;
