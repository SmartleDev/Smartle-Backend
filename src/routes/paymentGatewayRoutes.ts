import express from 'express';
import {paymentGateway, paymentWebhook} from '../controller/paymentGatewayController';

const router = express.Router();

router.post("/create-checkout-session", paymentGateway);
router.post("/webhook",express.raw({type: 'application/json'}), paymentWebhook);

export default router;