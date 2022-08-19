"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coursesController_1 = require("../controller/coursesController");
const router = express_1.default.Router();
router.get("/modules/:id", coursesController_1.getModuleforCourse);
exports.default = router;
