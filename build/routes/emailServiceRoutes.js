"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailServiceController_1 = require("../controller/emailServiceController");
const router = express_1.default.Router();
router.post("/tryEmail", emailServiceController_1.trialEmail);
exports.default = router;