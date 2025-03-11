/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { orderMedicineService } from './medicine-order.service';
import AppError from '../../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// const createMedicineOrder = catchAsync(async (req, res) => {
//   const customer = req.user?._id;

//   if (!customer) {
//     throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
//   }
//   const medicineOrderData = {
//     ...req.body,
//     customer: customer,
//   };

//   const result = await orderMedicineService.createMedicineOrderService(
//     medicineOrderData,
//     customer,
//     req.ip!
//   );
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     success: true,
//     message: 'Order created successfully',
//     data: result,
//   });
// });

const createMedicineOrder = catchAsync(async (req, res) => {
  try {
    const customer = req.user?._id;
    if (!customer) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
    }

    const { product, quantity, prescriptionImage } = req.body;

    if (!product || !quantity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Product and quantity are required.',
      );
    }

    const medicineOrderData = {
      ...req.body,
      customer,
    };

    const result = await orderMedicineService.createMedicineOrderService(
      medicineOrderData,
      customer,
      req.ip || '0.0.0.0', // Ensure a default value for safety
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Order creation failed',
    );
  }
});

const verifyMedicinePayment = catchAsync(async (req, res) => {
  const order = await orderMedicineService.verifyMedicinePayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order verified successfully',
    data: order,
  });
});

const getUserMedicineOrders = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const result = await orderMedicineService.getAllOrdersByUser(userId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Orders retrieved successfully',
      data: result,
    });
  },
);

const deleteMedicineOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  await orderMedicineService.deleteOrderFromDB(orderId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
  });
});

const adminDeleteMedicineOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderMedicineService.adminDeleteOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const orderMedicineController = {
  createMedicineOrder,
  verifyMedicinePayment,
  getUserMedicineOrders,
  deleteMedicineOrder,
  adminDeleteMedicineOrder,
};
