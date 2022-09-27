"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhook = exports.paymentGateway = void 0;
const config_1 = __importDefault(require("../config/config"));
const Stripe = require('stripe');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = Stripe(process.env.STRIPE_KEY);
let endpointSecret;
//endpointSecret = "whsec_8f05fed3fa8d7ba5c2840b239916355863fa2e4e7d81da93a8e49db83a0bbf20";
exports.paymentGateway = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_name, course_amount, course_img, course_description, course_id, student_id, parent_id, voucher_name } = req.body;
    let voucher = "NO";
    if (voucher_name !== "") {
        voucher = voucher_name;
    }
    const customer = yield stripe.customers.create({
        metadata: {
            parent_id: parent_id.toString(),
            student_id: student_id.toString(),
            courses_id: course_id.toString(),
            voucher_applied: voucher,
        }
    });
    const session = yield stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: course_name,
                        images: [course_img || null],
                        description: course_description || ""
                    },
                    unit_amount: course_amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/afterbook`,
        cancel_url: `${process.env.CLIENT_URL}`,
    });
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 1099,
    //   currency: 'inr',
    //   payment_method_types: ['card'],
    //   receipt_email:  'adeebshah4@gmail.com',
    // });
    // console.log(invoice)
    // console.log(paymentIntent)
    res.send({ url: session.url });
}));
const paymentWebhook = (request, response) => {
    const sig = request.headers['stripe-signature'];
    let data;
    let eventType;
    if (endpointSecret) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
            console.log("Verfied Webhook");
            // console.log(request.body)
        }
        catch (err) {
            // console.log(request.body)
            // console.log(JSON.stringify(request.body))
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object;
        eventType = event.type;
    }
    else {
        data = request.body.data.object;
        eventType = request.body.type;
        //  console.log(request.body.data.object)
    }
    // Handle the event
    if (eventType === "checkout.session.completed") {
        stripe.customers.retrieve(data.customer)
            .then((customer) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            console.log(customer);
            console.log("data:", data);
            // stripe.invoices.sendInvoice(
            //   data?.id
            // );
            let iterator = data === null || data === void 0 ? void 0 : data.payment_method_types.values();
            config_1.default.query('INSERT INTO payment (payment_mode, payment_amount, payment_dateandtime, payment_voucherapplied, payment_currency,payment_email, payment_name, payment_status, payment_for_course_id, payment_parent_id, payment_student_id, payment_country) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [iterator.next().value, (data === null || data === void 0 ? void 0 : data.amount_total) / 100, new Date(), (_a = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _a === void 0 ? void 0 : _a.voucher_applied, data === null || data === void 0 ? void 0 : data.currency, (_b = data === null || data === void 0 ? void 0 : data.customer_details) === null || _b === void 0 ? void 0 : _b.email, (_c = data === null || data === void 0 ? void 0 : data.customer_details) === null || _c === void 0 ? void 0 : _c.name, data === null || data === void 0 ? void 0 : data.payment_status, (_d = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _d === void 0 ? void 0 : _d.courses_id, (_e = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _e === void 0 ? void 0 : _e.parent_id, (_f = customer === null || customer === void 0 ? void 0 : customer.metadata) === null || _f === void 0 ? void 0 : _f.student_id, (_h = (_g = data === null || data === void 0 ? void 0 : data.customer_details) === null || _g === void 0 ? void 0 : _g.address) === null || _h === void 0 ? void 0 : _h.country], (err, rows) => {
                if (err) {
                    console.log(err);
                }
            });
        })
            .catch((err) => console.log(err.message));
    }
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntent = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
};
exports.paymentWebhook = paymentWebhook;
