import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import habitRoutes from './routes/habitRoutes';
import { startReminderScheduler } from './utils/reminderScheduler';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

const PORT = process.env.PORT || 5000;
startReminderScheduler();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
