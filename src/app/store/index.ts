import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import meetingUiReducer from './slices/meetingUiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    meetingUi: meetingUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable MediaStream / DOM refs in Redux checks
        ignoredPaths: ['meetingUi.activeLocalStream'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
