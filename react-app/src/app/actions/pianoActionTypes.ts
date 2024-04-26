export const SET_KEY_PRESSED = 'SET_KEY_PRESSED';
export const SET_KEY_RELEASED = 'SET_KEY_RELEASED';

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

export type PianoAction = 
      SetKeyPressedAction
    | SetKeyReleasedAction;