import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { Configuration, CreateMidiRequest, DeleteMidiRequest, GetMidiRequest, MidiApi } from '../../generated/midi-api';
import { MidiAction, FETCH_USER_MIDIS_REQUEST, FETCH_USER_MIDIS_SUCCESS, FETCH_USER_MIDIS_FAILURE,
    FETCH_PUBLIC_MIDIS_REQUEST, FETCH_PUBLIC_MIDIS_SUCCESS, FETCH_PUBLIC_MIDIS_FAILURE, FETCH_MIDI_DATA_REQUEST,
    FETCH_MIDI_DATA_SUCCESS, FETCH_MIDI_DATA_FAILURE, DELETE_MIDI_REQUEST, DELETE_MIDI_SUCCESS, DELETE_MIDI_FAILURE,
    CREATE_MIDI_REQUEST, CREATE_MIDI_SUCCESS, CREATE_MIDI_FAILURE } from './midiActionTypes'

export const fetchUserMidis = (): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
  dispatch({ type: FETCH_USER_MIDIS_REQUEST });
  try {
    const token = getState().user.token;
    const midiApi = new MidiApi(new Configuration({accessToken: token})); 
    const response = await midiApi.getUserMidis();
    dispatch({ type: FETCH_USER_MIDIS_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: FETCH_USER_MIDIS_FAILURE, payload: error as string });
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
      dispatch({ type: FETCH_PUBLIC_MIDIS_FAILURE, payload: error as string });
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
      dispatch({ type: FETCH_MIDI_DATA_FAILURE, payload: error as string });
    }
};

export const createMidi = (request: CreateMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: CREATE_MIDI_REQUEST, payload: { request } });
    try {
      const token = getState().user.token;
      const midiApi = new MidiApi(new Configuration({accessToken: token})); 
      const response = await midiApi.createMidi(request);
      dispatch({ type: CREATE_MIDI_SUCCESS, payload: response });
    } catch (error) {
      dispatch({ type: CREATE_MIDI_FAILURE, payload: error as string });
    }
};

export const deleteMidi = (request: DeleteMidiRequest): ThunkAction<void, RootState, null, MidiAction> => async (dispatch, getState) => {
    dispatch({ type: DELETE_MIDI_REQUEST, payload: { request } });
    try {
      const token = getState().user.token;
      const midiApi = new MidiApi(new Configuration({accessToken: token})); 
      const response = await midiApi.deleteMidi(request);
      dispatch({ type: DELETE_MIDI_SUCCESS, payload: response });
    } catch (error) {
      dispatch({ type: DELETE_MIDI_FAILURE, payload: error as string });
    }
};