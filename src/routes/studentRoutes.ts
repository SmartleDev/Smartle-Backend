import express from 'express';
import {getAllStudents} from '../controller/studentController';

const router = express.Router();

router.get("/email", getAllStudents);

export default router;