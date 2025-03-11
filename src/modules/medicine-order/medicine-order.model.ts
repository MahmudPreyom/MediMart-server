/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { TOrderMedicine } from './medicine-order.interface';
// import Medicine from '../medicine/medicine.model';

const OrderMedicineSchema: Schema = new Schema<TOrderMedicine>(
  {
    email: { type: String, required: false },
    customer: { type: Schema.ObjectId, ref: 'User', required: true },
    product: { type: Schema.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    totalPrice: { type: Number, required: [true, 'Total price is required.'] },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    prescriptionImage: {
      type: String,
      default: false,
      // required: async function (this: any) {
      //   const medicine = await Medicine.findById(this.product);
      //   return medicine?.prescriptionRequired || false;
    },
    // }
    transaction: {
      id: { type: String, required: false },
      transactionStatus: { type: String, required: false },
      bank_status: { type: String, required: false },
      sp_code: { type: String, required: false },
      sp_message: { type: String, required: false },
      method: { type: String, required: false },
      date_time: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  },
);

const OrderMedicine = model<TOrderMedicine>(
  'OrderMedicine',
  OrderMedicineSchema,
);
export default OrderMedicine;
