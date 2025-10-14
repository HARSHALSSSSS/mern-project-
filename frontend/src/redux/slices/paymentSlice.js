import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  isLoading: false,
};

export const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
    },
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
