/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../app/errors/AppError';
import { User } from '../users/user.model';
import { TOrderMedicine } from './medicine-order.interface';
import mongoose from 'mongoose';
import { orderUtils } from './order.utils';
import Medicine from '../medicine/medicine.model';
import OrderMedicine from './medicine-order.model';

// const createMedicineOrderService = async (
//   data: TOrderMedicine,
//   userId: string,
//   client_ip: string,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//     }

//     const { product, quantity } = data;
//     if (!data.customer) {
//       data.customer = new mongoose.Types.ObjectId(user._id);
//       // data.customer = user._id.toString();
//     }

//     const medicine = await Medicine.findById(product).session(session);
//     if (!medicine || medicine.quantity < quantity) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Insufficient stock or product not found.',
//       );
//     }

//     data.totalPrice = medicine.price * quantity;
//     medicine.quantity -= quantity;
//     medicine.inStock = medicine.quantity > 0;
//     await medicine.save({ session });

//     const orderData = { ...data, customer: user._id };
//     const result = await OrderMedicine.create([orderData], { session });
//     await result[0].populate('customer', 'name email role');

//     await session.commitTransaction();
//     session.endSession();

//     const shurjopayPayload = {
//       amount: data.totalPrice,
//       order_id: result[0]._id,
//       currency: 'BDT',
//       customer_name: user.name,
//       customer_email: user.email,
//       customer_phone: 'N/A',
//       customer_address: 'N/A',
//       customer_city: 'N/A',
//       client_ip,
//     };

//     const payment = await orderUtils.makePaymentAsync(shurjopayPayload);
//     if (payment?.transactionStatus) {
//       result[0] = await result[0].updateOne({
//         transaction: {
//           id: payment?.sp_order_id,
//           transactionStatus: payment?.transactionStatus,
//         },
//       });
//     }

//     return payment.checkout_url;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Order creation failed');
//   }
// };

const createMedicineOrderService = async (
  data: TOrderMedicine,
  userId: string,
  client_ip: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const { product, quantity, prescriptionImage } = data;
    if (!data.customer) {
      data.customer = new mongoose.Types.ObjectId(user._id);
    }

    const medicine = await Medicine.findById(product).session(session);
    if (!medicine || medicine.quantity < quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or product not found.',
      );
    }

    // **Check prescription requirement**
    if (medicine.prescriptionRequired && !prescriptionImage) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'This medicine requires a prescription. Please upload a prescription image.',
      );
    }

    data.totalPrice = medicine.price * quantity;
    medicine.quantity -= quantity;
    medicine.inStock = medicine.quantity > 0;
    await medicine.save({ session });

    const orderData = { ...data, customer: user._id };
    const result = await OrderMedicine.create([orderData], { session });
    await result[0].populate('customer', 'name email role');

    await session.commitTransaction();
    session.endSession();

    const shurjopayPayload = {
      amount: data.totalPrice,
      order_id: result[0]._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: 'N/A',
      customer_address: 'N/A',
      customer_city: 'N/A',
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment?.transactionStatus) {
      await result[0].updateOne({
        transaction: {
          id: payment?.sp_order_id,
          transactionStatus: payment?.transactionStatus,
        },
      });
    }

    return payment.checkout_url;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Order creation failed',
    );
  }
};

const verifyMedicinePayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);
  if (verifiedPayment.length) {
    await OrderMedicine.findOneAndUpdate(
      { 'transaction.id': order_id },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transaction_status': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status === 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status === 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status === 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }
  return verifiedPayment;
};

const getAllOrdersByUser = async (userId: string) => {
  const userOrders = await OrderMedicine.find({ customer: userId }).populate({
    path: 'product',
    select: 'name',
  });
  if (!userOrders || userOrders.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found for this user');
  }
  return userOrders;
};

const deleteOrderFromDB = async (id: string, userId: string) => {
  const order = await OrderMedicine.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  if (order.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Unauthorized to delete this order',
    );
  }
  return await OrderMedicine.findByIdAndDelete(id);
};

const adminDeleteOrder = async (id: string) => {
  const order = await OrderMedicine.findById(id);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }
  return await OrderMedicine.findByIdAndDelete(id);
};

export const orderMedicineService = {
  createMedicineOrderService,
  verifyMedicinePayment,
  getAllOrdersByUser,
  deleteOrderFromDB,
  adminDeleteOrder,
};
