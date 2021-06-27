import express, { json } from 'express';
import cors from 'cors';
//importing routes
import productRoutes from './routes/product_routes';

// Initialization
const app = express();

//middlewares
app.use(json());
app.use(cors());

//routes
app.use('/api/products',productRoutes);


export default app;