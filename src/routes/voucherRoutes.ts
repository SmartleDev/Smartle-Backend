import express from 'express';
import {checkVoucher, voucherUsageCount} from '../controller/voucherController';

const router = express.Router();

router.post("/checkvoucher", checkVoucher);
router.post("/voucherCount", voucherUsageCount);

export default router;