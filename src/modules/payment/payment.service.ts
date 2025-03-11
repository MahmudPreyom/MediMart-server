// import Stripe from 'stripe';
// import { StatusCodes } from 'http-status-codes';
// import config from '../../app/config';
// import AppError from '../../app/errors/AppError';
// import { OrderBiCycleModel } from '../biCycle_order/biCycle.-order.model';

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const stripe = new Stripe(config.stripe_secret_key as string);

// export const createPaymentIntent = async (orderId: string, userId: string) => {
//   const order = await OrderBiCycleModel.findById(orderId).populate('product');

//   if (!order) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
//   }

//   if (order.customer.toString() !== userId.toString()) {
//     throw new AppError(StatusCodes.FORBIDDEN, 'Unauthorized access');
//   }

//   // Calculate total price in cents
//   const amount = order.totalPrice * 100;

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency: 'usd',
//     metadata: { orderId: order._id.toString() },
//   });

//   return {
//     clientSecret: paymentIntent.client_secret,
//   };
// };
