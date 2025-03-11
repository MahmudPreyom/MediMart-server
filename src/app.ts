import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import UserRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import MedicineRouter from './modules/medicine/medicine.routes';
import OrderMedicineRouter from './modules/medicine-order/medicine-order.routes';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // origin: ['https://bi-cycle-store-client.vercel.app'],
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/medicine', MedicineRouter);
app.use('/api/orders', OrderMedicineRouter);
app.use('/api/user', UserRoutes);

app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Medi Mart');
});
// console.log(process.cwd());
export default app;
