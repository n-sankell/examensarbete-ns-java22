import { CLOSE_CREATE_MIDI_MODAL, CLOSE_CREATE_USER_MODAL, CLOSE_LOGIN_MODAL, CLOSE_PUBLIC_MIDIS, CLOSE_USER_MIDIS, DisplayAction, DisplayState, SHOW_CREATE_MIDI_MODAL, SHOW_CREATE_USER_MODAL, SHOW_LOGIN_MODAL, SHOW_PUBLIC_MIDIS, SHOW_USER_MIDIS } from "../actions/displayActionTypes";

const initialState: DisplayState = {
    showLoginModal: false,
    showCreateUserModal: false,
    showCreateMidiModal: false,
    showPublicMidis: false,
    showUserMidis: false,
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
        case SHOW_PUBLIC_MIDIS:
            return {
                ...state,
                showPublicMidis: true,
            }
        case CLOSE_PUBLIC_MIDIS:
            return {
                ...state,
                showPublicMidis: false,
            }
        case SHOW_USER_MIDIS:
            return {
                ...state,
                showUserMidis: true,
            }
        case CLOSE_USER_MIDIS:
            return {
                ...state,
                showUserMidis: false,
            }
        default:
            return state;
    }
};
  
export default displayReducer;