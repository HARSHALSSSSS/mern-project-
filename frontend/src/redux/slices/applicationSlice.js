import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
