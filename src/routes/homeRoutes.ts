import express from 'express';
import {
    contactUs,
    keyEvents
} from '../controller/homeController';

const router = express.Router();

router.post("/contactus", contactUs);
router.get("/keyEvents/:id", keyEvents);

export default router;