import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import midiReducer from './reducers/midiReducer';
import displayReducer from './reducers/displayReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    midi: midiReducer,
    display: displayReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
