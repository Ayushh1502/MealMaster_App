import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/users', userRouter);



app.listen(8081, () => {
    mongoose.connect(process.env.MONGO_URI);
    console.log('Server is running on port 8081');
});




