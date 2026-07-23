import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  initializing: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
       state.initializing = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
            state.initializing = false; 

      state.error = action.payload;
    },
     initializationComplete: (state) => { 
      state.initializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
       localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  changePasswordStart: (state) => {
  state.loading = true;
  state.error = null;
},

changePasswordSuccess: (state) => {
  state.loading = false;
},

changePasswordFailure: (state, action) => {
  state.loading = false;
  state.error = action.payload;
},
});

export const { loginStart, loginSuccess, loginFailure,initializationComplete, logout, updateProfile,
  changePasswordStart,
changePasswordSuccess,
changePasswordFailure,
 } = authSlice.actions;
export default authSlice.reducer;