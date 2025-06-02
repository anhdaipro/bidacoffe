import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import express, { Request, Response } from 'express';
import productTransactionRoutes from '@backend/routes/productTransactionRoutes';
import productRoutes from '@backend/routes/productRoutes';
import userRoutes from '@backend/routes/userRoutes';
import billiardTableRoutes from '@backend/routes/billiardTableRouter';
import tableSessionRoutes from '@backend/routes/tableSessionRoutes';
import reportRoutes from '@backend/routes/reportRouter';
import paymentRoutes from '@backend/routes/paymentRoutes'
import employeeRoutes from '@backend/routes/employeeRoute'
import shiftRoutes from '@backend/routes/shiftRoutes'
import scheduleRoutes from '@backend/routes/scheduleRouter'
import timeSheetRoutes from '@backend/routes/timeSheetRouter'
import bodyParser from  'body-parser';
import path from 'path';
import dotenv from 'dotenv';
// Load biến môi trường từ file .env
dotenv.config();
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
 
app.prepare().then(() => {
  const server = express();

  // Middleware để parse JSON
  server.use(bodyParser.json()); 
  server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  // for parsing application/xwww-
  server.use(bodyParser.urlencoded({ extended: true })); 
  //form-urlencoded
  server.use('/api', userRoutes)
  server.use('/api/employee', employeeRoutes)
  server.use('/api/product-transactions', productTransactionRoutes)
  server.use('/api/products', productRoutes);
  server.use('/api/payment', paymentRoutes);
  server.use('/api/tablesession', tableSessionRoutes);
  server.use('/api/report', reportRoutes);
  server.use('/api/billiard-table', billiardTableRoutes);
  server.use('/api/shift', shiftRoutes);
  server.use('/api/schedule', scheduleRoutes);
  server.use('/api/timesheet', timeSheetRoutes);
  // Route test đơn giản
  server.get('/hello', (_req: Request, res: Response) => {
    res.send('Hello World!');
  });
  // Tất cả route còn lại giao cho Next.js xử lý
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Dùng Express để xử lý các route cụ thể
    server(req as any, res as any, () => {
      handle(req, res, parsedUrl);
    });
  });

  httpServer.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
})
//lsof -i :3000
//kill -9 119792