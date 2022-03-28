"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
router.post("/signup", authController_1.signUp);
router.post("/login", authController_1.login);
router.post("/logout", authController_1.logout);
router.post("/code", authController_1.confrimCode);
router.post("/getUser", authController_1.getAllUsers);
router.post("/resendcode", authController_1.resendCode);
router.post("/rememberme", authController_1.rememberDevice);
router.post("/loginwithoutpass", authController_1.passwordLessLogin);
//parent and child routes
router.post("/parentpopluate", authController_1.loginParentDataInput);
router.post("/selectlearner", authController_1.childrenSelect);
router.post("/createchild", authController_1.createChild);
exports.default = router;
