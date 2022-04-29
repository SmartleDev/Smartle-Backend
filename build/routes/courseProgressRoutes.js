"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseProgressController_1 = require("../controller/courseProgressController");
const router = express_1.default.Router();
router.get("/getProgressCourseModule/:id", courseProgressController_1.getProgressCourseModule);
router.get("/getProgressModuleTopic/:id", courseProgressController_1.getProgressModuleTopic);
exports.default = router;
