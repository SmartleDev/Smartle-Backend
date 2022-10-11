"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailServiceController_1 = require("../controller/emailServiceController");
const router = express_1.default.Router();
router.post('/accountCreationEmailService', emailServiceController_1.accountCreationEmailService);
router.post('/addLearnerEmailService', emailServiceController_1.addLearnerEmailService);
router.post('/enrollCourseEmailService', emailServiceController_1.enrollCourseEmailService);
router.post('/enrollTrialCourseEmailService', emailServiceController_1.enrollTrialCourseEmailService);
router.post('/contactus', emailServiceController_1.contactUs);
router.post('/registerIntrest', emailServiceController_1.registerIntrest);
router.post('/CourseInvoice', emailServiceController_1.CourseInvoice);
exports.default = router;
