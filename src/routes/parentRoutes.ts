import express from 'express';
import {getAllParents} from '../controller/parentController';

const router = express.Router();

router.get("/parent", getAllParents);

export default router;