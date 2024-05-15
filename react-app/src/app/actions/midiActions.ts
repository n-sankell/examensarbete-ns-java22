import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { Configuration, CreateMidiRequest, DeleteMidiRequest, EditMidiRequest, ErrorResponse, ErrorResponseFromJSON, GetMidiRequest, MidiApi, ResponseError, ValidationError, ValidationException, ValidationExceptionFromJSON, instanceOfErrorResponse, instanceOfValidationException } from '../../generated/midi-api';
import { MidiAction, FETCH_USER_MIDIS_REQUEST, FETCH_USER_MIDIS_SUCCESS, FETCH_USER_MIDIS_FAILURE,
    FETCH_PUBLIC_MIDIS_REQUEST, FETCH_PUBLIC_MIDIS_SUCCESS, FETCH_PUBLIC_MIDIS_FAILURE, FETCH_MIDI_DATA_REQUEST,
    FETCH_MIDI_DATA_SUCCESS, FETCH_MIDI_DATA_FAILURE, DELETE_MIDI_REQUEST, DELETE_MIDI_SUCCESS, DELETE_MIDI_FAILURE,
    CREATE_MIDI_REQUEST, CREATE_MIDI_SUCCESS, CREATE_MIDI_FAILURE, PARSE_MIDI_REQUEST, PARSE_MIDI_SUCCESS,
    PARSE_MIDI_FAILURE, EDIT_MIDI_REQUEST, EDIT_MIDI_SUCCESS, EDIT_MIDI_FAILURE } from './midiActionTypes'
import { base64ToArrayBuffer } from '../util/MidiParser';
import { Midi, MidiJSON } from '@tonejs/midi';
import { MidiWrapper } from '../types/MidiWrapper';

export const fetchUserMidis = (): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
  dispatch({ type: FETCH_USER_MIDIS_REQUEST });
  try {
    const token = getState().user.token;
    const midiApi = new MidiApi(new Configuration({accessToken: token})); 
    const response = await midiApi.getUserMidis();
    dispatch({ type: FETCH_USER_MIDIS_SUCCESS, payload: response });
  } catch (error) {
    const message = await packageMidiError(error);
    dispatch({ type: FETCH_USER_MIDIS_FAILURE, payload: message });
  }
};

export const fetchPublicMidis = (): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: FETCH_PUBLIC_MIDIS_REQUEST });
    try {
      const token = getState().user.token;
      const midiApi = new MidiApi(new Configuration({accessToken: token})); 
      const response = await midiApi.getPublicMidis();
      dispatch({ type: FETCH_PUBLIC_MIDIS_SUCCESS, payload: response });
    } catch (error) {
      const message = await packageMidiError(error);
      dispatch({ type: FETCH_PUBLIC_MIDIS_FAILURE, payload: message });
    }
};

export const fetchMidiAndData = (request: GetMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: FETCH_MIDI_DATA_REQUEST, payload: { request } });
    try {
      const token = getState().user.token;
      const midiApi = new MidiApi(new Configuration({accessToken: token})); 
      const response = await midiApi.getMidi(request);
      dispatch({ type: FETCH_MIDI_DATA_SUCCESS, payload: response });
    } catch (error) {
      const message = await packageMidiError(error);
      dispatch({ type: FETCH_MIDI_DATA_FAILURE, payload: message });
    }
};

export const createMidi = (request: CreateMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: CREATE_MIDI_REQUEST, payload: { request } });
    try {
      const token = getState().user.token;
      const midiApi = new MidiApi(new Configuration({accessToken: token}));

      const response = await midiApi.createMidi(request)

      dispatch({ type: CREATE_MIDI_SUCCESS, payload: response });

    } catch (error: unknown) {
      const message = await packageMidiError(error);
      dispatch({ type: CREATE_MIDI_FAILURE, payload: message })
    }
};

export const editMidi = (request: EditMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
  dispatch({ type: EDIT_MIDI_REQUEST, payload: { request } });
  try {
    const token = getState().user.token;
    const midiApi = new MidiApi(new Configuration({ accessToken: token })); 
    const response = await midiApi.editMidi(request);
    dispatch({ type: EDIT_MIDI_SUCCESS, payload: response });
  } catch (error) {
    const message = await packageMidiError(error);
    dispatch({ type: EDIT_MIDI_FAILURE, payload: message});
  }
};

export const deleteMidi = (request: DeleteMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: DELETE_MIDI_REQUEST, payload: { request } });
    try {
      const token: string = getState().user.token;
      const midiApi: MidiApi = new MidiApi(new Configuration({accessToken: token})); 
      const response: object = await midiApi.deleteMidi(request);
      dispatch({ type: DELETE_MIDI_SUCCESS, payload: response });
    } catch (error) {
      const message = await packageMidiError(error);
      dispatch({ type: DELETE_MIDI_FAILURE, payload: message });
    }
};

export const parseMidi = (request: string): ThunkAction<void, RootState, null, MidiAction> => async (dispatch) => {
  dispatch({ type: PARSE_MIDI_REQUEST, payload: { request } });
  try {
    const midiData: ArrayBuffer = base64ToArrayBuffer(request);
    const parsedMidi: MidiJSON = new Midi(midiData).toJSON();
    const stateObject: MidiWrapper = {
      midi: parsedMidi
    }
    dispatch({ type: PARSE_MIDI_SUCCESS, payload: stateObject });
  } catch (error) {
    dispatch({ type: PARSE_MIDI_FAILURE, payload: "Failed to read midi file" });
  }
};

const packageMidiError = async (error: unknown): Promise<string> => {
  let message: string = "Unknown error";
  if (error instanceof ResponseError) {
    const json = await error.response.json();
    if (instanceOfValidationException(json)) {
      const ve: ValidationException = ValidationExceptionFromJSON(json);
      const firstError: ValidationError = ve.errors[0];
      message = firstError.error + " - " + firstError.field;
    } else if (instanceOfErrorResponse(json)) {
      const re: ErrorResponse = ErrorResponseFromJSON(json);
      message = re.errorMessage;
    }
  }
  return message;
}