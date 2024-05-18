import * as display from "../actions/displayActionTypes";

const initialState: display.DisplayState = {
    showLoginModal: false,
    showCreateUserModal: false,
    showCreateMidiModal: false,
    showPublicMidis: false,
    showUserMidis: false,
    showEditUserModal: false,
    showEditMidiModal: false,
    showOpenMidiModal: false,
};

const displayReducer = (state = initialState, action: display.DisplayAction): display.DisplayState => {
    switch (action.type) {
        case display.SHOW_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: true,
            }
        case display.CLOSE_LOGIN_MODAL:
            return {
                ...state,
                showLoginModal: false,
            }
        case display.SHOW_CREATE_USER_MODAL:
            return {
                ...state,
                showCreateUserModal: true,
            }
        case display.CLOSE_CREATE_USER_MODAL:
            return {
                ...state,
                showCreateUserModal: false,
            }
        case display.SHOW_CREATE_MIDI_MODAL:
            return {
                ...state,
                showCreateMidiModal: true,
            }
        case display.CLOSE_CREATE_MIDI_MODAL:
            return {
                ...state,
                showCreateMidiModal: false,
            }
        case display.SHOW_EDIT_USER_MODAL:
            return {
                ...state,
                showEditUserModal: true,
            }
        case display.CLOSE_EDIT_USER_MODAL:
            return {
                ...state,
                showEditUserModal: false,
            }
        case display.SHOW_EDIT_MIDI_MODAL:
            return {
                ...state,
                showEditMidiModal: true,
            }
        case display.CLOSE_EDIT_MIDI_MODAL:
            return {
                ...state,
                showEditMidiModal: false,
            }
        case display.SHOW_PUBLIC_MIDIS:
            return {
                ...state,
                showPublicMidis: true,
            }
        case display.CLOSE_PUBLIC_MIDIS:
            return {
                ...state,
                showPublicMidis: false,
            }
        case display.SHOW_USER_MIDIS:
            return {
                ...state,
                showUserMidis: true,
            }
        case display.CLOSE_USER_MIDIS:
            return {
                ...state,
                showUserMidis: false,
            }
        case display.SHOW_OPEN_MIDI:
            return {
                ...state,
                showOpenMidiModal: true,
            }
        case display.CLOSE_OPEN_MIDI:
            return {
                ...state,
                showOpenMidiModal: false,
            }
        default:
            return state;
    }
};
  
export default displayReducer;