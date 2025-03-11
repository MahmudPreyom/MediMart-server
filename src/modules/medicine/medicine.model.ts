import { model, Schema } from 'mongoose';
import { TBiCycle } from './medicine.interface';

const BiCycleSchema: Schema = new Schema<TBiCycle>(
  {
    name: { type: String, required: [true, 'Name is required.'] },
    brand: { type: String, required: [true, 'Brand is required.'] },
    // image: { type: String, required: [true, 'Brand is required.'] },
    price: { type: Number, required: [true, 'Price is required.'] },
    type: {
      type: String,
      enum: {
        values: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        message:
          '{VALUE} is not a valid type. Choose from Mountain, Road, Hybrid, BMX, or Electric.',
      },
      required: [true, 'Type is required.'],
    },
    description: { type: String, required: [true, 'Description is required.'] },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
    },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const BiCycle = model<TBiCycle>('BiCycle', BiCycleSchema);
export default BiCycle;
