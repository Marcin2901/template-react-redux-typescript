import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// żeby móc określić typ dispatcha
export type AppDispatch = typeof store.dispatch;

// Żeby określić typ stata 
export type RootState = ReturnType<typeof store.getState>;

// Typ dla Thunków
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
