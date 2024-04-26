export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const CLOSE_LOGIN_MODAL = 'CLOSE_LOGIN_MODAL';
export const SHOW_CREATE_USER_MODAL = 'SHOW_CREATE_USER_MODAL';
export const CLOSE_CREATE_USER_MODAL = 'CLOSE_CREATE_USER_MODAL';
export const SHOW_CREATE_MIDI_MODAL = 'SHOW_CREATE_MIDI_MODAL';
export const CLOSE_CREATE_MIDI_MODAL = 'CLOSE_CREATE_MIDI_MODAL';

interface ShowLoginModal {
    type: typeof SHOW_LOGIN_MODAL;
}
interface CloseLoginModal {
    type: typeof CLOSE_LOGIN_MODAL;
}

interface ShowCreateUserModal {
    type: typeof SHOW_CREATE_USER_MODAL;
}
interface CloseCreateUserModal {
    type: typeof CLOSE_CREATE_USER_MODAL;
}

interface ShowCreateMidiModal {
    type: typeof SHOW_CREATE_MIDI_MODAL;
}
interface CloseCreateMidiModal {
    type: typeof CLOSE_CREATE_MIDI_MODAL;
}

export type DisplayAction =
    | ShowLoginModal
    | CloseLoginModal
    | ShowCreateUserModal
    | CloseCreateUserModal
    | ShowCreateMidiModal
    | CloseCreateMidiModal;

export interface DisplayState {
    showLoginModal: boolean;
    showCreateUserModal: boolean;
    showCreateMidiModal: boolean;
}