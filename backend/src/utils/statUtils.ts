import moment from 'moment';

export const calculateHabitStats = (habit: any) => {
  const today = moment().startOf('day');
  let currentStreak = 0;
  let longestStreak = 0;
  let completionCount = 0;

  let streak = 0;
  let prevDay = today.clone();

  // Sort history by date descending
  const sortedHistory = (habit.history || []).sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    const entryDay = moment(entry.date).startOf('day');

    // For completion rate (last 7 days)
    if (today.diff(entryDay, 'days') <= 6 && entry.completed) {
      completionCount++;
    }

    // For streak calculation
    if (i === 0 && entryDay.isSame(today)) {
      streak = 1;
    } else if (prevDay.diff(entryDay, 'days') === 1 && entry.completed) {
      streak++;
    } else if (prevDay.diff(entryDay, 'days') !== 1) {
      streak = entry.completed ? 1 : 0;
    }

    longestStreak = Math.max(longestStreak, streak);
    prevDay = entryDay;
  }

  currentStreak = streak;

  return {
    currentStreak,
    longestStreak,
    completionRate: Math.round((completionCount / 7) * 100),
  };
};
