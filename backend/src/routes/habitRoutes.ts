import express from 'express';
import { createHabit, getHabits, toggleHabit, deleteHabit, setHabitReminder } from '../controllers/habitController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware); // Protecting all habit-related routes

router.post('/', createHabit);
router.get('/', getHabits);
router.patch('/:id', toggleHabit);
router.delete('/:id', deleteHabit);
router.put('/:id/reminder', setHabitReminder); // ✅ frontend calls this
 

export default router;
