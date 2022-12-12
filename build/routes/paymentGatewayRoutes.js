"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentGatewayController_1 = require("../controller/paymentGatewayController");
const router = express_1.default.Router();
router.post("/create-checkout-session", paymentGatewayController_1.paymentGateway);
router.post("/webhook", express_1.default.raw({ type: 'application/json' }), paymentGatewayController_1.paymentWebhook);
exports.default = router;
