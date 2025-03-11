// /* eslint-disable no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import Stripe from 'stripe';
// import config from '../../app/config';
// import { OrderBiCycleModel } from '../biCycle_order/biCycle.-order.model';

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const stripe = new Stripe(config.stripe_secret_key as string);

// export const handleStripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   try {
//     // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       config.stripe_webhook_secret as string,
//     );

//     if (event.type === 'payment_intent.succeeded') {
//       const paymentIntent = event.data.object;
//       const orderId = paymentIntent.metadata.orderId;

//       await OrderBiCycleModel.findByIdAndUpdate(orderId, { status: 'Paid' });

//       res.status(200).send('Success');
//     }
//   } catch (error) {
//     res.status(400).send(`Webhook error: Something went to wrong`);
//   }
// };
