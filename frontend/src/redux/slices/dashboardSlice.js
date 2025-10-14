import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {},
  isLoading: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { setStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
