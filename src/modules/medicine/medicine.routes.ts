import { Router } from 'express';
import { MedicineController } from './medicine.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.const';
import { MedicineValidationSchema } from './medicine.validation';
import validateRequest from '../../middlewares/validateRequest';

const MedicineRouter = Router();

MedicineRouter.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(MedicineValidationSchema.createMedicineValidationSchema),
  MedicineController.createMedicine,
);
MedicineRouter.get('/:id', MedicineController.getSingleMedicine);
MedicineRouter.patch(
  '/:productId',
  auth(USER_ROLE.admin),
  MedicineController.updateMedicine,
);
MedicineRouter.delete(
  '/:productId',
  auth(USER_ROLE.admin),
  MedicineController.deleteMedicine,
);
MedicineRouter.get('/', MedicineController.getMedicines);

export default MedicineRouter;
