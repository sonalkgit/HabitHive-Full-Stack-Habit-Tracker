import { Request, Response } from 'express';
import Habit from '../models/Habit';
import moment from 'moment';
import cron from 'node-cron';


interface AuthRequest extends Request {
  userId?: string;
}

export const createHabit = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.userId;
  console.log('Creating habit:', { title, userId });

  try {
    const newHabit = await Habit.create({ title, userId });
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ message: 'Error creating habit' });
  }
};

// export const getHabits = async (req: AuthRequest, res: Response) => {
//   const userId = req.userId;
//   try {
//     const habits = await Habit.find({ userId });
//     res.json(habits);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching habits' });
//   }
// };

// export const getHabits = async (req: AuthRequest, res: Response) => {
//   const userId = req.userId;

//   try {
//     const habits = await Habit.find({ userId });
//     const today = moment().startOf('day');

//     const updatedHabits = await Promise.all(
//       habits.map(async (habit) => {
//         const lastCompleted = moment(habit.lastCompletedDate).startOf('day');

//         // If the habit was completed on a previous day, reset the completed status
//         if (!lastCompleted.isSame(today)) {
//           habit.completed = false;
//           await habit.save();
//         }

//         return habit;
//       })
//     );
//     res.json(updatedHabits);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching habits' });
//   }
// };
const calculateHabitStats = (habit: any) => {
  const history = habit.history || [];  // Assuming habit has a 'history' array

  // Calculate current streak
  let currentStreak = 0;
  let longestStreak = 0;
  let completionCount = 0;
  const today = moment().startOf('day');

  history.forEach((entry: any) => {
    const entryDate = moment(entry.date).startOf('day');
    if (entry.completed) {
      completionCount += 1;
      if (entryDate.isSame(today.clone().subtract(currentStreak, 'days'))) {
        currentStreak += 1;
      } else {
        currentStreak = 1;  // Reset streak if there's a break in the completion
      }
      longestStreak = Math.max(longestStreak, currentStreak);  // Track the longest streak
    }
  });

  // Calculate weekly completion rate (percentage)
  const weekStart = today.clone().subtract(7, 'days');
  const last7DaysHistory = history.filter((entry: any) =>
    moment(entry.date).isBetween(weekStart, today, 'day', '[]')
  );
  const completionRate = last7DaysHistory.length > 0
    ? Math.round((completionCount / last7DaysHistory.length) * 100)
    : 0;

  return {
    currentStreak,
    longestStreak,
    completionRate,
  };
};

export const getHabits = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const habits = await Habit.find({ userId });
    const today = moment().startOf('day');

    const updatedHabits = await Promise.all(
      habits.map(async (habit) => {
        const lastCompleted = moment(habit.lastCompletedDate).startOf('day');

        // If the habit was completed on a previous day, reset the completed status
        if (!lastCompleted.isSame(today)) {
          habit.completed = false;
          await habit.save();
        }

        // Calculate stats and add them to the habit object
        const stats = calculateHabitStats(habit);
        
        // Return the habit object with stats
        return {
          ...habit.toObject(),
          stats,  // Include stats here
        };
      })
    );

    res.json(updatedHabits);  // Return updated habits with stats
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching habits' });
  }
};

// export const toggleHabit = async (req: AuthRequest, res: Response) => {
//   const habitId = req.params.id;
//   try {
//     const habit = await Habit.findById(habitId);
//     if (!habit) return res.status(404).json({ message: 'Habit not found' });

//     habit.completed = !habit.completed;
//     await habit.save();
//     res.json(habit);
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating habit' });
//   }
// };

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  const habitId = req.params.id;
  try {
    await Habit.findByIdAndDelete(habitId);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting habit' });
  }
};

export const toggleHabit = async (req: AuthRequest, res: Response) => {
  const habitId = req.params.id;

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const today = moment().startOf('day');
    if (!today.isValid()) {
      console.error('Invalid moment object for today:', today);
      return res.status(500).json({ message: 'Error calculating today\'s date' });
    }
    const lastCompleted = habit.lastCompletedDate
      ? moment(habit.lastCompletedDate).startOf('day')
      : null;

    // console.log('today:', today.format('YYYY-MM-DD'));
    // console.log('lastCompleted:', lastCompleted?.format('YYYY-MM-DD'));
    console.log('today:', today.format('YYYY-MM-DD'));
    console.log('lastCompleted:', lastCompleted?.format('YYYY-MM-DD HH:mm:ss Z'));
    console.log('Are they the same?', lastCompleted?.isSame(today.clone().subtract(1, 'day'), 'day'));

    // Toggle logic
    if (habit.completed && lastCompleted?.isSame(today)) {
      habit.completed = false;
    } else {
      habit.completed = true;



      if (!lastCompleted) {
        habit.streak = 1;
        console.log('First completion. Set streak to 1.');

      } else if (lastCompleted.isSame(today.clone().subtract(1, 'day'))) {
        habit.streak += 1;
        console.log('Consecutive day. Incremented streak to', habit.streak);

      } else if (!lastCompleted.isSame(today)) {
        habit.streak = 1;
        console.log('Not consecutive. Reset streak to 1.');

      }

      habit.lastCompletedDate = today.toDate();
    }

    // ✅ Add or update today's history entry
    const existingEntryIndex = habit.history.findIndex(entry =>
      moment(entry.date).isSame(today, 'day')
    );

    if (existingEntryIndex >= 0) {
      habit.history[existingEntryIndex].completed = habit.completed;
    } else {
      habit.history.push({ date: today.toDate(), completed: habit.completed });
    }

    await habit.save();

    // ✅ Add this block for stats
    const stats = {
      currentStreak: habit.streak,
      lastCompletedDate: habit.lastCompletedDate,
      totalDaysTracked: habit.history.length,
      totalCompletions: habit.history.filter(entry => entry.completed).length,
    };

    return res.json({
      ...habit.toObject(),
      stats,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error toggling habit' });
  }
};

export const setHabitReminder = async (req: Request, res: Response) => {
  try {
    const habitId = req.params.id;
    const { reminderTime } = req.body;

    if (!reminderTime) {
      return res.status(400).json({ message: 'Reminder time is required' });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { reminderTime: new Date(reminderTime) },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ message: 'Reminder set successfully', habit: updatedHabit });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


