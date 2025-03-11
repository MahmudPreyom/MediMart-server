import { Router } from 'express';
import { orderMedicineController } from './medicine-order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.const';

const OrderMedicineRouter = Router();

OrderMedicineRouter.post(
  '/',
  auth(USER_ROLE.customer),
  orderMedicineController.createMedicineOrder,
);

OrderMedicineRouter.get(
  '/verify',
  auth(USER_ROLE.customer),
  orderMedicineController.verifyMedicinePayment,
);

OrderMedicineRouter.get(
  '/order/my-orders',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  orderMedicineController.getUserMedicineOrders,
);

OrderMedicineRouter.delete(
  '/order/:orderId',
  auth(USER_ROLE.admin),
  orderMedicineController.adminDeleteMedicineOrder,
);

OrderMedicineRouter.delete(
  '/:orderId',
  auth(USER_ROLE.customer),
  orderMedicineController.deleteMedicineOrder,
);

export default OrderMedicineRouter;
