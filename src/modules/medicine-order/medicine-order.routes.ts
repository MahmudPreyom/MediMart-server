import { Router } from 'express';
import { orderBiCycleController } from './medicine-order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.const';

const OrderBiCycleRouter = Router();

OrderBiCycleRouter.post(
  '/',
  auth('customer'),
  orderBiCycleController.createOrderBiCycle,
);
OrderBiCycleRouter.get(
  '/verify',
  auth(USER_ROLE.customer),
  orderBiCycleController.verifyPayment,
);
OrderBiCycleRouter.get(
  '/revenue',
  auth(USER_ROLE.admin),
  orderBiCycleController.getBiCycleOrderController,
);
OrderBiCycleRouter.get(
  '/:orderId',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  orderBiCycleController.getBiCycleOrderData,
);
// ===============================================demo=========================
OrderBiCycleRouter.get(
  // '/order/:userId',
  '/order/my-orders',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  orderBiCycleController.getUserOrders,
);
// =======================================================demo==================

// =====================================getadminallorder=====================================
OrderBiCycleRouter.get(
  '/order/get-all-orders',
  auth(USER_ROLE.admin),
  orderBiCycleController.getAllOrdersByAdmin,
);

// =====================================getadminallorder=====================================

// ========================================admin order delete==========================================

OrderBiCycleRouter.delete(
  '/order/:orderId',
  auth(USER_ROLE.admin),
  orderBiCycleController.adminDeletedOrder,
);

// ========================================admin order delete==========================================

OrderBiCycleRouter.patch(
  '/:orderId',
  auth(USER_ROLE.customer),
  orderBiCycleController.updateBiCycleOrder,
);
OrderBiCycleRouter.patch(
  '/orderShipping/:id',
  auth(USER_ROLE.admin),
  orderBiCycleController.adminShippingOrder,
);
OrderBiCycleRouter.delete(
  '/:orderId',
  auth(USER_ROLE.customer),
  orderBiCycleController.deleteOrder,
);

export default OrderBiCycleRouter;
