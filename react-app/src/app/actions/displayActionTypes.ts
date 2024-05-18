export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const CLOSE_LOGIN_MODAL = 'CLOSE_LOGIN_MODAL';
export const SHOW_CREATE_USER_MODAL = 'SHOW_CREATE_USER_MODAL';
export const CLOSE_CREATE_USER_MODAL = 'CLOSE_CREATE_USER_MODAL';
export const SHOW_CREATE_MIDI_MODAL = 'SHOW_CREATE_MIDI_MODAL';
export const CLOSE_CREATE_MIDI_MODAL = 'CLOSE_CREATE_MIDI_MODAL';
export const SHOW_USER_MIDIS = 'SHOW_USER_MIDIS';
export const CLOSE_USER_MIDIS = 'CLOSE_USER_MIDIS';
export const SHOW_PUBLIC_MIDIS = 'SHOW_PUBLIC_MIDIS';
export const CLOSE_PUBLIC_MIDIS = 'CLOSE_PUBLIC_MIDIS';
export const SHOW_EDIT_USER_MODAL = 'SHOW_EDIT_USER_MODAL';
export const CLOSE_EDIT_USER_MODAL = 'CLOSE_EDIT_USER_MODAL';
export const SHOW_EDIT_MIDI_MODAL = 'SHOW_EDIT_MIDI_MODAL';
export const CLOSE_EDIT_MIDI_MODAL = 'CLOSE_EDIT_MIDI_MODAL';
export const SHOW_OPEN_MIDI = 'SHOW_OPEN_MIDI';
export const CLOSE_OPEN_MIDI = 'CLOSE_OPEN_MIDI';

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

interface ShowEditUserModal {
    type: typeof SHOW_EDIT_USER_MODAL;
}
interface CloseEditUserModal {
    type: typeof CLOSE_EDIT_USER_MODAL;
}

interface ShowCreateMidiModal {
    type: typeof SHOW_CREATE_MIDI_MODAL;
}
interface CloseCreateMidiModal {
    type: typeof CLOSE_CREATE_MIDI_MODAL;
}

interface ShowEditMidiModal {
    type: typeof SHOW_EDIT_MIDI_MODAL;
}
interface CloseEditMidiModal {
    type: typeof CLOSE_EDIT_MIDI_MODAL;
}

interface ShowPublicMidis {
    type: typeof SHOW_PUBLIC_MIDIS;
}
interface ClosePublicMidis {
    type: typeof CLOSE_PUBLIC_MIDIS;
}

interface ShowUserMidis {
    type: typeof SHOW_USER_MIDIS;
}
interface CloseUserMidis {
    type: typeof CLOSE_USER_MIDIS;
}

interface ShowOpenMidi {
    type: typeof SHOW_OPEN_MIDI;
}
interface CloseOpenMidi {
    type: typeof CLOSE_OPEN_MIDI;
}

export type DisplayAction =
    | ShowLoginModal
    | CloseLoginModal
    | ShowCreateUserModal
    | CloseCreateUserModal
    | ShowCreateMidiModal
    | CloseCreateMidiModal
    | ShowPublicMidis
    | ClosePublicMidis
    | ShowUserMidis
    | CloseUserMidis
    | ShowEditUserModal
    | CloseEditUserModal
    | ShowEditMidiModal
    | CloseEditMidiModal
    | ShowOpenMidi
    | CloseOpenMidi;

export interface DisplayState {
    showLoginModal: boolean;
    showCreateUserModal: boolean;
    showCreateMidiModal: boolean;
    showUserMidis: boolean;
    showPublicMidis: boolean;
    showEditUserModal: boolean;
    showEditMidiModal: boolean;
    showOpenMidiModal: boolean;
}