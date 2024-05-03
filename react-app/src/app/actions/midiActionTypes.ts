import { Midi } from "@tonejs/midi";
import { CreateMidiRequest, DeleteMidiRequest, GetMidiRequest, MidiWithData, Midis } from "../../generated/midi-api";
import { MidiWrapper } from "../types/MidiWrapper";

export const FETCH_USER_MIDIS_REQUEST = 'FETCH_USER_MIDIS_REQUEST';
export const FETCH_USER_MIDIS_SUCCESS = 'FETCH_USER_MIDIS_SUCCESS';
export const FETCH_USER_MIDIS_FAILURE = 'FETCH_USER_MIDIS_FAILURE';
export const FETCH_PUBLIC_MIDIS_REQUEST = 'FETCH_PUBLIC_MIDIS_REQUEST';
export const FETCH_PUBLIC_MIDIS_SUCCESS = 'FETCH_PUBLIC_MIDIS_SUCCESS';
export const FETCH_PUBLIC_MIDIS_FAILURE = 'FETCH_PUBLIC_MIDIS_FAILURE';
export const FETCH_MIDI_DATA_REQUEST = 'FETCH_MIDI_DATA_REQUEST';
export const FETCH_MIDI_DATA_SUCCESS = 'FETCH_MIDI_DATA_SUCCESS';
export const FETCH_MIDI_DATA_FAILURE = 'FETCH_MIDI_DATA_FAILURE';
export const CREATE_MIDI_REQUEST = 'CREATE_MIDI_REQUEST';
export const CREATE_MIDI_SUCCESS = 'CREATE_MIDI_SUCCESS';
export const CREATE_MIDI_FAILURE = 'CREATE_MIDI_FAILURE';
export const DELETE_MIDI_REQUEST = 'DELETE_MIDI_REQUEST';
export const DELETE_MIDI_SUCCESS = 'DELETE_MIDI_SUCCESS';
export const DELETE_MIDI_FAILURE = 'DELETE_MIDI_FAILURE';
export const PARSE_MIDI_REQUEST = 'PARSE_MIDI_REQUEST';
export const PARSE_MIDI_SUCCESS = 'PARSE_MIDI_SUCCESS';
export const PARSE_MIDI_FAILURE = 'PARSE_MIDI_FAILURE';
export const READ_MIDI_REQUEST = 'READ_MIDI_REQUEST';
export const READ_MIDI_SUCCESS = 'READ_MIDI_SUCCESS';
export const READ_MIDI_FAILURE = 'READ_MIDI_FAILURE';
export const PLAY_MIDI = 'PLAY_MIDI';
export const PAUSE_MIDI = 'PAUSE_MIDI';

interface FetchUserMidisRequestAction {
    type: typeof FETCH_USER_MIDIS_REQUEST;
}
interface FetchUserMidisSuccessAction {
    type: typeof FETCH_USER_MIDIS_SUCCESS;
    payload: Midis;
}
interface FetchUserMidisFailureAction {
    type: typeof FETCH_USER_MIDIS_FAILURE;
    payload: string;
}

interface FetchPublicMidisRequestAction {
    type: typeof FETCH_PUBLIC_MIDIS_REQUEST;
}
interface FetchPublicMidisSuccessAction {
    type: typeof FETCH_PUBLIC_MIDIS_SUCCESS;
    payload: Midis;
}
interface FetchPublicMidisFailureAction {
    type: typeof FETCH_PUBLIC_MIDIS_FAILURE;
    payload: string;
}

interface FetchMidiAndDataRequestAction {
    type: typeof FETCH_MIDI_DATA_REQUEST;
    payload: {
        request: GetMidiRequest;
      }
}
interface FetchMidiAndDataSuccessAction {
    type: typeof FETCH_MIDI_DATA_SUCCESS;
    payload: MidiWithData;
}
interface FetchMidiAndDataFailureAction {
    type: typeof FETCH_MIDI_DATA_FAILURE;
    payload: string;
}

interface CreateMidiRequestAction {
    type: typeof CREATE_MIDI_REQUEST;
    payload: {
        request: CreateMidiRequest;
      }
}
interface CreateMidiSuccessAction {
    type: typeof CREATE_MIDI_SUCCESS;
    payload: MidiWithData;
} 
interface CreateMidiFailureAction {
    type: typeof CREATE_MIDI_FAILURE;
    payload: string;
}

interface DeleteMidiRequestAction {
    type: typeof DELETE_MIDI_REQUEST;
    payload: {
        request: DeleteMidiRequest;
      }
}
interface DeleteMidiSuccessAction {
    type: typeof DELETE_MIDI_SUCCESS;
} 
interface DeleteMidiFailureAction {
    type: typeof DELETE_MIDI_FAILURE;
    payload: string;
}

interface ParseMidiRequestAction {
    type: typeof PARSE_MIDI_REQUEST;
    payload: {
        request: string;
      }
}
interface ParseMidiSuccessAction {
    type: typeof PARSE_MIDI_SUCCESS;
    payload: MidiWrapper;
}
interface ParseMidiFailureAction {
    type: typeof PARSE_MIDI_FAILURE;
    payload: string;
}

interface ReadMidiRequestAction {
    type: typeof READ_MIDI_REQUEST;
    payload: {
        request: string;
      }
}
interface ReadMidiSuccessAction {
    type: typeof READ_MIDI_SUCCESS;
    payload: MidiWrapper;
}
interface ReadMidiFailureAction {
    type: typeof READ_MIDI_FAILURE;
    payload: string;
}

interface PlayMidiAction {
    type: typeof PLAY_MIDI;
}
interface PauseMidiAction {
    type: typeof PAUSE_MIDI;
}

export type MidiAction =
    | FetchUserMidisRequestAction
    | FetchUserMidisSuccessAction
    | FetchUserMidisFailureAction
    | FetchPublicMidisRequestAction
    | FetchPublicMidisSuccessAction
    | FetchPublicMidisFailureAction
    | FetchMidiAndDataRequestAction
    | FetchMidiAndDataSuccessAction
    | FetchMidiAndDataFailureAction
    | CreateMidiRequestAction
    | CreateMidiSuccessAction
    | CreateMidiFailureAction
    | DeleteMidiRequestAction
    | DeleteMidiSuccessAction
    | DeleteMidiFailureAction
    | ParseMidiRequestAction
    | ParseMidiSuccessAction
    | ParseMidiFailureAction
    | ReadMidiRequestAction
    | ReadMidiSuccessAction
    | ReadMidiFailureAction
    | PlayMidiAction
    | PauseMidiAction;

export interface MidiState {
    doFetchMidis: boolean;
    loading: boolean,
    publicMidis: Midis | null;
    userMidis: Midis | null;
    activeMidi: MidiWithData | null;
    error: string | null;
    displayPublicMidiFetchError: boolean;
    displayPrivateMidiFetchError: boolean;
    displayCreateMidiError: boolean;
    displayDeleteMidiError: boolean;
    parsedMidi: MidiWrapper;
    midiIsPlaying: boolean;
}