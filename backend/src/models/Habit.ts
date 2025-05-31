import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  lastCompletedDate: { type: Date }, // NEW
  streak: { type: Number, default: 0 },
  history: [
    {
      date: { type: Date, required: true },
      completed: { type: Boolean, default: true }
    }
  ],
  reminderTime: {
    type: String, // e.g., "09:30"
    required: false,
  }  
  
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;