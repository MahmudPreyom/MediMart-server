/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { orderBiCycleService } from './medicine-order.service';
import AppError from '../../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createOrderBiCycle = catchAsync(async (req, res) => {
  const customer = req.user?._id;

  if (!customer) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User Not Authenticated');
  }
  const biCycleOrderData = {
    ...req.body,
    customer: customer,
  };

  const result = await orderBiCycleService.createOrderBiCycleService(
    biCycleOrderData,
    customer,
    req.ip!,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderBiCycleService.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Order verified successfully',
    data: order,
  });
});

const getBiCycleOrderData = catchAsync(async (req, res) => {
  const biCycleOrderId = req.params.orderId;
  const userId = req.user?._id;
  const result = await orderBiCycleService.getSingleBiCycleOrderFromDB(
    biCycleOrderId,
    userId,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order Retrieved successfully',
    data: result,
  });
});

const updateBiCycleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id;
  const result = await orderBiCycleService.updateBiCycleOderIntoDB(
    orderId,
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Update Order bicycle successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id;

  const result = await orderBiCycleService.deleteOrderFromDB(orderId, userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
  });
});

const adminDeletedOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const result = await orderBiCycleService.adminDeletedOrder(orderId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

const adminShippingOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await orderBiCycleService.adminShippingOrder(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Order shipped successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Order update failed',
    });
  }
};

const getBiCycleOrderController = async (req: Request, res: Response) => {
  try {
    const result = await orderBiCycleService.getBiCycleOrder();

    res.send({
      message: 'Revenue calculated successfully',
      status: true,
      data: result,
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Something went wrong',
      error,
    });
  }
};
// ==========================================================demo===============================================
const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const result = await orderBiCycleService.getAllOrdersByUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

// const getBiCycleOrderbyUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId; // Get userId from URL parameter

//     if (!userId) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: 'User ID is required' });
//     }

//     const result = await orderBiCycleService.getBiCycleOrderbyuser(userId); // Pass userId to service

//     res.send({
//       message: 'Orders fetched successfully', // Improved message
//       status: true,
//       data: result,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// ==========================================================demo===============================================

// =====================================================getallordersbyAdmin==================================================
const getAllOrdersByAdmin = catchAsync(async (req, res) => {
  // const { searchTerm } = req.query;
  const result = await orderBiCycleService.getAllOrdersByAdmin();
  // console.log(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order Retrieved successfully',
    data: result,
  });
});
// =====================================================getallordersbyAdmin==================================================

export const orderBiCycleController = {
  createOrderBiCycle,
  getBiCycleOrderController,
  getBiCycleOrderData,
  updateBiCycleOrder,
  adminShippingOrder,
  deleteOrder,
  adminDeletedOrder,
  getUserOrders,
  verifyPayment,
  getAllOrdersByAdmin,
};
