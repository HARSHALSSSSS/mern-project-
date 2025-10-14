import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import applicationReducer from './slices/applicationSlice';
import paymentReducer from './slices/paymentSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    applications: applicationReducer,
    payments: paymentReducer,
    maintenance: maintenanceReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
