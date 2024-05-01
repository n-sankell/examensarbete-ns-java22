import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import midiReducer from './reducers/midiReducer';
import displayReducer from './reducers/displayReducer';
import pianoReducer from './reducers/pianoReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    midi: midiReducer,
    display: displayReducer,
    piano: pianoReducer,
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
