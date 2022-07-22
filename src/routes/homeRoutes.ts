import express from 'express';
import {
    keyEvents,
} from '../controller/homeController';

const router = express.Router();

router.get("/keyEvents/:id", keyEvents);

export default router;