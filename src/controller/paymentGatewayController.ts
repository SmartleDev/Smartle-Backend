import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';
const Stripe = require('stripe')
import dotenv from 'dotenv'

dotenv.config()

const stripe = Stripe(process.env.STRIPE_KEY)
let endpointSecret: any;

//endpointSecret = "whsec_8f05fed3fa8d7ba5c2840b239916355863fa2e4e7d81da93a8e49db83a0bbf20";

export const paymentGateway  =  ( async (req: Request, res: any) => {

  const {course_name, course_amount, course_img, course_description, course_id, student_id, parent_id} = req.body
  const customer = await stripe.customers.create({
    metadata:{
      parent_id: parent_id.toString(),
      student_id : student_id.toString(),
      courses_id : course_id.toString(),
      voucher_applied : "NO"
    }
  })

        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: course_name,
                  images : [course_img || null],
                  description: course_description || ""
                },
                unit_amount: parseInt(course_amount)*100,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.CLIENT_URL}/afterbook`,
          cancel_url: `${process.env.CLIENT_URL}`,
        });
      
        res.send({url: session.url});
       
});

export const paymentWebhook = (request: Request, response: Response) => {
  const sig = request.headers['stripe-signature'];

  let data: any;
  let eventType: any;

  if(endpointSecret){

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("Verfied Webhook")
      // console.log(request.body)
    } catch (err: any) {
      // console.log(request.body)
      // console.log(JSON.stringify(request.body))
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  }else{
    data = request.body.data.object;
    eventType = request.body.type;
    //  console.log(request.body.data.object)
  }


  // Handle the event
  if(eventType === "checkout.session.completed"){
    stripe.customers.retrieve(data.customer)
    .then((customer: any)=> {
        // console.log(customer)
        // console.log("data:", data)
        let iterator = data?.payment_method_types.values()
        db.query('INSERT INTO payment (payment_mode, payment_amount, payment_dateandtime, payment_voucherapplied, payment_currency,payment_email, payment_name, payment_status, payment_for_course_id, payment_parent_id, payment_student_id, payment_country) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[iterator.next().value, data?.amount_total/100, new Date(), customer?.metadata?.voucher_applied, data?.currency, data?.customer_details?.email, data?.customer_details?.name, data?.payment_status, customer?.metadata?.courses_id, customer?.metadata?.parent_id, customer?.metadata?.student_id, data?.customer_details?.address?.country] ,(err: any, rows: any) =>{
          if(err){
              console.log(err);
          }
      });
      })
      .catch((err: any) => console.log(err.message))
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

