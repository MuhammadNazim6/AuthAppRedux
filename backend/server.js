import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';


const port = process.env.PORT || 5000;
import { notFound , errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js';
import connectDB from './config/db.js';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();
const app = express()

app.use(cors());
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

console.log(path.join(__dirname, 'public/images'));

app.use('/images', express.static(path.resolve(__dirname,'public/images')));
// app.use(express.static("/public/images"))

app.use('/api/users',userRoutes);
app.use('/api/admin',adminRoutes);

app.use(notFound); 
app.use(errorHandler); 


app.listen(port , ()=>console.log(`Server running at http://localhost:${port}`))
