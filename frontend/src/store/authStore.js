import { create } from 'zustand';
import { apiLogin, apiRegister } from '../api';

// This is a named export, which matches how it's being imported in your components.
export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiLogin(credentials);
      if (response.access_token && response.user) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        set({ token: response.access_token, user: response.user, isLoading: false });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message || 'An unknown error occurred.';
      set({ error: errorMessage, isLoading: false });
      console.error("Login error:", errorMessage);
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await apiRegister(userData);
      set({ isLoading: false });
    } catch (error) {
       const errorMessage = error.message || 'An unknown error occurred.';
       set({ error: errorMessage, isLoading: false });
       console.error("Registration error:", errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
