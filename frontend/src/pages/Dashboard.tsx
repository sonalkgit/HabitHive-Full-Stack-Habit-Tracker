import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { createHabit, deleteHabit, fetchHabits, toggleHabit } from '../redux/habitSlice';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom'; 
import styles from './Pages.module.css';
import moment from 'moment';
import { getLast7Days } from '../utils/getLast7Days'; // Adjust path if different

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { habits } = useSelector((state: RootState) => state.habit);
  const [title, setTitle] = useState('');
  const [streakUpdated, setStreakUpdated] = useState<string | null>(null); 

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchHabits(user.token));
    } else {
      navigate('/login'); 
    }
  }, [user, dispatch, navigate]);

  const getStreakClass = (habit: any) => {
    if (habit._id === streakUpdated) {
      return styles.streakText + ' ' + styles.pop; 
    }
    return styles.streakText;
  };

  const handleAddHabit = () => {
    if (title.trim() && user?.token) {
      dispatch(createHabit({ title, token: user.token }));
      setTitle('');
    }
  };

  const handleToggle = (id: string) => {
    if (user?.token) {
      const oldHabit = habits.find((h) => h._id === id);
      dispatch(toggleHabit({ id, token: user.token }))
        .unwrap()
        .then((updatedHabit: any) => {
          if (oldHabit && updatedHabit && updatedHabit.streak > (oldHabit.streak || 0)) {
            setStreakUpdated(id);
            setTimeout(() => setStreakUpdated(null), 1200);
          }
        });
    }
  };

  const handleDelete = (id: string) => {
    if (user?.token) {
      dispatch(deleteHabit({ id, token: user.token }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <div className={styles.navbar}>
        <div className={styles.navTitle}>HabitHive</div>
        <div className={styles.navRight}>
          <span className={styles.navEmail}>{user?.email}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.dashboardContainer}>
        <h2 className={styles.welcomeText}>Welcome, {user?.email}</h2>
        <div className={styles.habitInput}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a habit..."
          />
          <button onClick={handleAddHabit}>Add</button>
        </div>
        <ul className={styles.habitList}>
          {habits.map((habit) => {
            const isCompleted = habit.completed;
            const streakLabel = isCompleted
              ? `🔥 Streak: ${habit.stats?.currentStreak || 0} Day${habit.stats?.currentStreak === 1 ? '' : 's'}`
              : '⚠️ Don’t forget today!';

            const totalDays = 7;
            const completedDays = habit.history?.filter(entry => entry.completed).length;
            const progressPercentage = (completedDays / totalDays) * 100;

            return (
              <li key={habit._id} className={styles.habitItem}>
                <span
                  className={isCompleted ? styles.completed + ' completed' : ''}
                  onClick={() => handleToggle(habit._id)}
                >
                  {habit.title}
                </span>
                <span className={getStreakClass(habit)}>{streakLabel}</span>

                <div className={styles.progressContainer}>
                  <div className={styles.percentageLabel}>{Math.round(progressPercentage)}% Complete</div>
                  <div className={styles.progressBarContainer}>
                    {/* {getLast7Days().map((day: moment.Moment, i: number) => {
                      const match = habit.history?.find(entry =>
                        moment(entry.date).isSame(day, 'day')
                      );

                      const filled = match?.completed;
                      const segmentClass = filled ? styles.progressSegment + ' ' + styles.completed : styles.progressSegment;
                      return <div key={i} className={segmentClass}></div>;
                    })} */}
                     {getLast7Days().map((day, i) => {
                        const match = habit.history?.find(entry =>
                          moment(entry.date).isSame(day, 'day')
                        );

                        const filled = match?.completed;
                        const isToday = moment().isSame(day, 'day');

                        return (
                          <div
                            key={i}
                            className={`${styles.progressSegment} ${filled ? styles.completed : styles.notCompleted} ${isToday ? styles.today : ''}`}
                            title={day.format('ddd, MMM D')}
                          ></div>
                        );
                      })}
                  </div>
                </div>

                <button onClick={() => handleDelete(habit._id)}>❌</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
