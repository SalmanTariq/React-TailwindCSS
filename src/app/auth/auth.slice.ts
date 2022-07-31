import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
  },
  reducers: {
    login: (state, action) => {
    },
  },
});

const reducer = AuthSlice.reducer;
export const { login } = AuthSlice.actions;

export { reducer as AuthReducer };
