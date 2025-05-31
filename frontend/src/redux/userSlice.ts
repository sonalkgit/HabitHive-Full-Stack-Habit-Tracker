// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// interface UserState {
//   user: null | { _id: string; email: string; token: string };
//   loading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// export const registerUser = createAsyncThunk(
//   'user/register',
//   async (formData: { email: string; password: string }, thunkAPI) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/register', formData);
//       return response.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response.data.message);
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   'user/login',
//   async (formData: { email: string; password: string }, thunkAPI) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', formData);
//       return response.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response.data.message);
//     }
//   }
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  user: null | { _id: string; email: string; token: string };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'), // Persist user data
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data)); // Store user data in localStorage
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user'); // Clear user data from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
