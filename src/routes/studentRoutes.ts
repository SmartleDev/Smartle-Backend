import express from 'express';
import {getAllStudents} from '../controller/studentController';

const router = express.Router();

router.get("/student", getAllStudents);

export default router;