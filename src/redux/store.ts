// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";
import syncReducer from "./slices/syncSlice";
import { createOfflineMiddleware } from "./middleware/offlineMiddleware";


export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createOfflineMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
