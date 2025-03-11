/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../app/errors/AppError';
import { User } from '../users/user.model';
import { TOrderBiCycle } from './medicine-order.interface';
import { OrderBiCycleModel } from './medicine-order.model';
import mongoose from 'mongoose';
import { orderUtils } from './order.utils';
import BiCycle from '../medicine/medicine.model';
// import { orderUtils } from './order.utils';

const createOrderBiCycleService = async (
  data: TOrderBiCycle,
  userId: string,
  client_ip: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate user existence
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const { product, quantity } = data;

    // Ensure email is set if required by schema
    if (!data.email) {
      data.email = user.email;
    }

    const bicycle = await BiCycle.findById(product).session(session);

    if (!bicycle || bicycle.quantity < quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or product not found.',
      );
    }

    // Calculate total price
    data.totalPrice = bicycle.price * quantity;

    // Reduce quantity and update inStock status
    bicycle.quantity -= quantity;
    bicycle.inStock = bicycle.quantity > 0;

    await bicycle.save({ session });

    if (!bicycle) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Insufficient stock or product not found.',
      );
    }

    // Create order with customer information
    const orderData = { ...data, customer: user._id };
    // console.log('o', orderData);

    const result = await OrderBiCycleModel.create([orderData], { session });
    // console.log('r', result);

    await result[0].populate('customer', 'name email role');

    await session.commitTransaction();
    session.endSession();

    // payment method
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
      result[0] = await result[0].updateOne({
        transaction: {
          id: payment?.sp_order_id,
          transactionStatus: payment?.transactionStatus,
        },
      });
    }

    return payment.checkout_url;
    // return { result, payment };
    // return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Something went to wrong',
    );
  }
};
// ===================================test====================================
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);
  if (verifiedPayment.length) {
    await OrderBiCycleModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transaction_status': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }
  return verifiedPayment;
};
// =====================================test======================================

const getSingleBiCycleOrderFromDB = async (id: string, userId: string) => {
  const bicycleOrderId = await OrderBiCycleModel.findById(id);

  if (!bicycleOrderId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (bicycleOrderId.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to see this order',
    );
  }

  return bicycleOrderId;
};

// ================================================demo===========================
const getAllOrdersByUser = async (userId: string) => {
  const userOrders = await OrderBiCycleModel.find({
    customer: userId,
  }).populate({ path: 'product', select: 'name' });

  if (!userOrders || userOrders.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No orders found for this user');
  }

  return userOrders;
};

// const getBiCycleOrderbyuser = async (userId: string) => {
//   try {
//     const orders = await OrderBiCycleModel.find({ customer: userId });
//     if (!userId) {
//       throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
//     }
//     return orders;
//   } catch (error) {
//     throw new AppError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to fetch orders',
//     );
//   }
// };
// ==============================================demo================================

// =================================================adminorderget================================================================
const getAllOrdersByAdmin = async () => {
  // let query = {};

  // if (searchTerm) {
  //   const regex = new RegExp(searchTerm, 'i');
  //   query = {
  //     $or: [{ name: regex }, { brand: regex }, { category: regex }],
  //   };
  // }
  const result = await OrderBiCycleModel.find();
  return result;
};
// =================================================adminorderget================================================================

const updateBiCycleOderIntoDB = async (
  id: string,
  userId: string,
  payload: Partial<TOrderBiCycle>,
) => {
  const order = await OrderBiCycleModel.findById(id);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this order',
    );
  }

  const result = await OrderBiCycleModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteOrderFromDB = async (id: string, userId: string) => {
  const deleteOrderId = await OrderBiCycleModel.findById(id);
  if (!deleteOrderId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (deleteOrderId?.customer.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this blog',
    );
  }

  const result = await OrderBiCycleModel.findByIdAndDelete(id);
  return result;
};

const adminDeletedOrder = async (id: string) => {
  const order = await OrderBiCycleModel.findById(id);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  const result = await OrderBiCycleModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete order',
    );
  }

  return result;
};

const adminShippingOrder = async (id: string) => {
  const orderBiCycle = await OrderBiCycleModel.findById(id);

  if (!orderBiCycle) {
    throw new Error('Order not found');
  }

  if (orderBiCycle.status === 'Shipped') {
    throw new Error('Order is already shipped!');
  }

  // Ensure the updated order is returned
  const result = await OrderBiCycleModel.findByIdAndUpdate(
    id,
    { status: 'Shipped' },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new Error('Failed to update order status');
  }

  return result;
};

const getBiCycleOrder = async (): Promise<{ totalRevenue: number }> => {
  const result = await OrderBiCycleModel.aggregate([
    {
      $lookup: {
        from: 'bicycles',
        localField: 'product',
        foreignField: '_id',
        as: 'bicycleDetails',
      },
    },
    {
      $unwind: '$bicycleDetails',
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $multiply: ['$bicycleDetails.price', '$quantity'],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);
  return result[0] || { totalRevenue: 0 };
};

export const orderBiCycleService = {
  createOrderBiCycleService,
  getBiCycleOrder,
  getSingleBiCycleOrderFromDB,
  updateBiCycleOderIntoDB,
  deleteOrderFromDB,
  adminDeletedOrder,
  adminShippingOrder,
  getAllOrdersByUser,
  verifyPayment,
  getAllOrdersByAdmin,
};
