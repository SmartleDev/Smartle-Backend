import express from "express";
import {
  controlTrial
} from "../controller/controlTrial";

const router = express.Router();

router.get("/", controlTrial);


export default router;
