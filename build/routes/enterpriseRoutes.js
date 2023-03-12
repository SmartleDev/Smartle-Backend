"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enterpriseController_1 = require("../controller/enterpriseController");
const router = express_1.default.Router();
router.get('/getHomeEnterpriseCourses', enterpriseController_1.getHomeEnterpriseCourses);
router.get('/getEnterpriseCourse/:courseName', enterpriseController_1.getEnterpriseCourse);
router.post('/getGradeInfo/', enterpriseController_1.getGradeInfo);
router.get('/getGrads/:courseName', enterpriseController_1.getGrads);
exports.default = router;
