import { KeyState, PianoAction, SET_KEY_PRESSED, SET_KEY_RELEASED } from "../actions/pianoActionTypes";
import { AnyAction } from 'redux';

const initialKeyState: KeyState = {};

const pianoReducer = (state: KeyState = initialKeyState, action: AnyAction): KeyState => {
    switch (action.type) {
        case SET_KEY_PRESSED:
            return {
                ...state,
                [action.payload.noteNumber]: true,
            };
        case SET_KEY_RELEASED:
            return {
                ...state,
                [action.payload.noteNumber]: false,
            };
        default:
            return state;
    }
};

export default pianoReducer;