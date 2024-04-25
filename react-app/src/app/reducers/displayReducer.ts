import { CLOSE_CREATE_MIDI_MODAL, CLOSE_CREATE_USER_MODAL, CLOSE_LOGIN_MODAL, DisplayAction, DisplayState, SHOW_CREATE_MIDI_MODAL, SHOW_CREATE_USER_MODAL, SHOW_LOGIN_MODAL } from "../actions/displayActionTypes";

const initialState: DisplayState = {
    showLoginModal: false,
    showCreateUserModal: false,
    showCreateMidiModal: false,
};

const displayReducer = (state = initialState, action: DisplayAction): DisplayState => {
    switch (action.type) {
        case SHOW_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: true,
            }
        case CLOSE_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: false,
            }
        case SHOW_CREATE_USER_MODAL:
            return {
                ...state,
                showCreateUserModal: true,
            }
        case CLOSE_CREATE_USER_MODAL:
            return {
                ...state,
                showCreateUserModal: false,
            }
        case SHOW_CREATE_MIDI_MODAL:
            return {
                ...state,
                showCreateMidiModal: true,
            }
        case CLOSE_CREATE_MIDI_MODAL:
            return {
                ...state,
                showCreateMidiModal: false,
            }
        default:
            return state;
    }
};
  
export default displayReducer;