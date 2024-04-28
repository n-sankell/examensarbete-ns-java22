import { ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CLOSE_CREATE_MIDI_MODAL, CLOSE_CREATE_USER_MODAL, CLOSE_LOGIN_MODAL, CLOSE_PUBLIC_MIDIS, CLOSE_USER_MIDIS, DisplayAction, SHOW_CREATE_MIDI_MODAL, SHOW_CREATE_USER_MODAL, SHOW_LOGIN_MODAL, SHOW_PUBLIC_MIDIS, SHOW_USER_MIDIS } from "./displayActionTypes";

export const displayLoginModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: SHOW_LOGIN_MODAL });
}
export const closeLoginModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: CLOSE_LOGIN_MODAL });
}

export const displayCreateUserModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: SHOW_CREATE_USER_MODAL });
}
export const closeCreateUserModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: CLOSE_CREATE_USER_MODAL });
}

export const displayCreateMidiModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: SHOW_CREATE_MIDI_MODAL });
}
export const closeCreateMidiModal = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: CLOSE_CREATE_MIDI_MODAL });
}

export const displayPublicMidis = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: SHOW_PUBLIC_MIDIS });
}
export const closePublicMidis = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: CLOSE_PUBLIC_MIDIS });
}

export const displayUserMidis = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: SHOW_USER_MIDIS });
}
export const closeUserMidis = (): ThunkAction<void, RootState, null, DisplayAction> => (dispatch) => {
    dispatch({ type: CLOSE_USER_MIDIS });
}