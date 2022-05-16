import express from 'express';
import {
    accountCreationEmailService,
    addLearnerEmailService,
    enrollCourseEmailService,
    enrollTrialCourseEmailService,
    
} from '../controller/emailServiceController';

const router = express.Router();

router.post("/accountCreationEmailService", accountCreationEmailService);
router.post("/addLearnerEmailService", addLearnerEmailService);
router.post("/enrollCourseEmailService", enrollCourseEmailService);
router.post("/enrollTrialCourseEmailService", enrollTrialCourseEmailService);

export default router;