import express from 'express';
import {
  accountCreationEmailService,
  addLearnerEmailService,
  enrollCourseEmailService,
  enrollTrialCourseEmailService,
  contactUs,
  registerIntrest,
  CourseInvoice,
} from '../controller/emailServiceController';

const router = express.Router();

router.post('/accountCreationEmailService', accountCreationEmailService);
router.post('/addLearnerEmailService', addLearnerEmailService);
router.post('/enrollCourseEmailService', enrollCourseEmailService);
router.post('/enrollTrialCourseEmailService', enrollTrialCourseEmailService);
router.post('/contactus', contactUs);
router.post('/registerIntrest', registerIntrest);
router.post('/CourseInvoice', CourseInvoice);

export default router;
