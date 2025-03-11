// import { createPaymentIntent } from './payment.service';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';

// export const createPaymentIntentHandler = catchAsync(async (req, res) => {
//   const { orderId } = req.body;
//   const userId = req.user?._id;

//   const result = await createPaymentIntent(orderId, userId);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Payment intent created successfully',
//     data: result,
//   });
// });
