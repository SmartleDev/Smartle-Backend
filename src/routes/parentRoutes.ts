import express from 'express';
import {getAllParents, setParentInfo, updateParent} from '../controller/parentController';

const router = express.Router();

router.get("/parent", getAllParents);
router.post("/setparentinfo", setParentInfo);
router.post("/updateparent", updateParent);

export default router;