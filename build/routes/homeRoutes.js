"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = require("../controller/homeController");
const router = express_1.default.Router();
router.post("/contactus", homeController_1.contactUs);
router.get("/keyEvents/:id", homeController_1.keyEvents);
exports.default = router;
