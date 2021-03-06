import express from "express";
import {
  signUp,
  login,
  confrimCode,
  getAllUsers,
  resendCode,
  rememberDevice,
  passwordLessLogin,
  loginParentDataInput,
  childrenSelect,
  createChild,
  logout,
  forgotPassword,
  forgotPasswordNext,
  verifyToken,
} from "../controller/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verifyToken", verifyToken);
router.post("/logout", logout);
router.post("/code", confrimCode);
router.post("/getUser", getAllUsers);
router.post("/resendcode", resendCode);
router.post("/rememberme", rememberDevice);
router.post("/loginwithoutpass", passwordLessLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/forgotPasswordNext", forgotPasswordNext);

//parent and child routes
router.post("/parentpopluate", loginParentDataInput);
router.post("/selectlearner", childrenSelect);
router.post("/createchild", createChild);

export default router;
