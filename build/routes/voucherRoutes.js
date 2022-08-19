"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voucherController_1 = require("../controller/voucherController");
const router = express_1.default.Router();
router.post("/checkvoucher", voucherController_1.checkVoucher);
router.post("/voucherCount", voucherController_1.voucherUsageCount);
exports.default = router;
