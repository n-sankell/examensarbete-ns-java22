export const SET_KEY_PRESSED = 'SET_KEY_PRESSED';
export const SET_KEY_RELEASED = 'SET_KEY_RELEASED';
export const SET_PIANO_READY = 'SET_PIANO_READY';

interface SetKeyPressedAction {
  type: typeof SET_KEY_PRESSED;
  payload: {
    noteNumber: number;
  };
}

interface SetKeyReleasedAction {
    type: typeof SET_KEY_RELEASED;
    payload: {
      noteNumber: number;
    };
}

interface SetPianoReadyAction {
  type: typeof SET_PIANO_READY;
  payload: {
    noteNumber: number;
  };
}

export type PianoAction = 
      SetKeyPressedAction
    | SetKeyReleasedAction
    | SetPianoReadyAction;

export interface KeyState {
    pianoReady: boolean;
    [noteNumber: number]: boolean;
}