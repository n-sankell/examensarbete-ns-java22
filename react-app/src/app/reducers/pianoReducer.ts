import { KeyState, PianoAction, SET_KEY_PRESSED, SET_KEY_RELEASED, SET_PIANO_READY } from "../actions/pianoActionTypes";
import { AnyAction } from 'redux';

const initialKeyState: KeyState = {
    pianoReady: false,
};

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
        case SET_PIANO_READY:
            return {
                ...state,
                pianoReady: action.payload,
            };
        default:
            return state;
    }
};

export default pianoReducer;