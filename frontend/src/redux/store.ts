import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import habitReducer from './habitSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    habit: habitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; // This is the default export
