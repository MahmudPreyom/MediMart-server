import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import OrderBiCycleRouter from './modules/medicine-order/medicine-order.routes';
import UserRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import BiCycleRouter from './modules/medicine/medicine.routes';
// import PaymentRouter from './modules/payment/payment.route';
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
app.use('/api/products', BiCycleRouter);
app.use('/api/orders', OrderBiCycleRouter);
app.use('/api/user', UserRoutes);
// app.use('/api/payment', PaymentRouter);
// app.use('/api/payment', PaymentRouter);

app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Bi Medi Mart');
});
// console.log(process.cwd());
export default app;
