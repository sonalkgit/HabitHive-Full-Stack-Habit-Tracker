// src/api/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const registerUser = (email: string, password: string) => {
  return axios.post(`${BASE_URL}/auth/register`, { email, password });
};

export const loginUser = (email: string, password: string) => {
  return axios.post(`${BASE_URL}/auth/login`, { email, password });
};

export const fetchHabitsAPI = (token: string) => {
  return axios.get(`${BASE_URL}/habits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createHabitAPI = (title: string, token: string) => {
  return axios.post(`${BASE_URL}/habits`, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// src/api/api.ts
export const toggleHabitAPI = (id: string, token: string) => {
  return axios.put(`${BASE_URL}/habits/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const setHabitReminder = (habitId: string, reminderTime: string) => {
  return axios.put(`/api/habits/${habitId}/reminder`, { reminderTime });
};


