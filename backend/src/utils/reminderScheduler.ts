import cron from 'cron';
import moment from 'moment';
import Habit from '../models/Habit'; // Assuming you have a Habit model
import { sendReminderEmail } from './emailSender';  // Import the email sender
import User from '../models/User';

// Start the reminder scheduler
export const startReminderScheduler = () => {
  // Schedule cron job to run daily at 9 AM
  const reminderJob = new cron.CronJob('0 9 * * *', async () => {
    console.log('⏰ Running daily habit reminder job at 9 AM...');

    try {
      const today = moment().startOf('day');  // Get today's date at 00:00 AM
      const habits = await Habit.find({
        completed: false,  // Find habits that are incomplete
        lastCompletedDate: { $lt: today.toDate() },  // Habits that were not completed today
      });

      // For each habit that needs a reminder, send an email to the user
      habits.forEach(async (habit) => {
        const user = await User.findById(habit.userId);  // Assuming habit is linked to a user
        if (user) {
          sendReminderEmail(user.email, habit.title);  // Send reminder email
        }
      });
    } catch (error) {
      console.error('Error running reminder job:', error);
    }
  });

  // Start the cron job
  reminderJob.start();
};
