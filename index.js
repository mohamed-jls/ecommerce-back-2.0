import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import cartRouter from './routes/cartRouter.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'
import authRouter from './routes/authRouter.js'

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err))

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.all('*', (res, req) => {
    res.status(404).json({message: 'route or methode incorrect'})
});

app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT);
});