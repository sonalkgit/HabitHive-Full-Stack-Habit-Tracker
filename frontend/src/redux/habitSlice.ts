import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Habit {
  _id: string;
  title: string;
  completed: boolean;
  lastCompletedDate?: string;
  streak?: number;
  history: { date: string; completed: boolean }[];
  stats: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
  reminderTime?: string;
}

interface HabitState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitState = {
  habits: [],
  loading: false,
  error: null,
};

export const createHabit = createAsyncThunk(
  'habit/create',
  async (habitData: { title: string; token: string }, thunkAPI) => {
    console.log('Dispatching createHabit with title:');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/habits',
        { title: habitData.title },
        {
          headers: {
            Authorization: `Bearer ${habitData.token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchHabits = createAsyncThunk(
  'habit/fetch',
  async (token: string, thunkAPI) => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const toggleHabit = createAsyncThunk(
    'habit/toggle',
    async (
      { id, token }: { id: string; token: string },
      thunkAPI
    ) => {
      try {
        const response = await axios.patch(
          `http://localhost:5000/api/habits/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to toggle habit');
      }
    }
  );
  

  export const deleteHabit = createAsyncThunk(
    'habit/delete',
    async (
      { id, token }: { id: string; token: string },
      thunkAPI
    ) => {
      try {
        await axios.delete(`http://localhost:5000/api/habits/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return id;
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete habit');
      }
    }
  );
  const habitSlice = createSlice({
    name: 'habit',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createHabit.fulfilled, (state, action) => {
          const habit = {
            ...action.payload,
            stats: action.payload.stats || {
              currentStreak: action.payload.streak || 0,
              longestStreak: 0,
              completionRate: 0,
            },
          };
          state.habits.push(habit);
        })
        .addCase(fetchHabits.fulfilled, (state, action) => {
          state.habits = action.payload.map((habit: any) => ({
            ...habit,
            stats: habit.stats || {
              currentStreak: habit.streak || 0,
              longestStreak: 0,
              completionRate: 0,
            },
          }));
        })
        .addCase(toggleHabit.fulfilled, (state, action) => {
          const index = state.habits.findIndex(h => h._id === action.payload._id);
          if (index !== -1) {
            state.habits[index] = {
              ...action.payload,
              stats: action.payload.stats || {
                currentStreak: action.payload.streak || 0,
                longestStreak: 0,
                completionRate: 0,
              },
            };
          }
        })
        .addCase(deleteHabit.fulfilled, (state, action) => {
          state.habits = state.habits.filter(h => h._id !== action.payload);
        });
    },
  });

// const habitSlice = createSlice({
//   name: 'habit',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createHabit.fulfilled, (state, action) => {
//         state.habits.push(action.payload);
//       })
//       .addCase(fetchHabits.fulfilled, (state, action) => {
//         state.habits = action.payload;
//       })
//       .addCase(toggleHabit.fulfilled, (state, action) => {
//         const index = state.habits.findIndex(h => h._id === action.payload._id);
//         if (index !== -1) state.habits[index] = action.payload;
//       })
//       .addCase(deleteHabit.fulfilled, (state, action) => {
//         state.habits = state.habits.filter(h => h._id !== action.payload);
//       });
//   },
// });


export default habitSlice.reducer;
