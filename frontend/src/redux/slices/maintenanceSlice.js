import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maintenanceRequests: [],
  isLoading: false,
};

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
    },
  },
});

export const { reset } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
