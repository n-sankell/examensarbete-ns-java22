import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { PianoAction, SET_KEY_PRESSED, SET_KEY_RELEASED, SET_PIANO_READY } from "./pianoActionTypes";
import { RootState } from "../store";

export const setKeyPressed = (noteNumber: number): ThunkAction<void, RootState, null, AnyAction> => async (dispatch) => {
    dispatch({ type: SET_KEY_PRESSED, payload: { noteNumber } });
};

export const setKeyReleased = (noteNumber: number): ThunkAction<void, RootState, null, PianoAction> => async (dispatch) => {
    dispatch({ type: SET_KEY_RELEASED, payload: { noteNumber } });
};

export const setPianoReady = (pianoReady: boolean): ThunkAction<void, RootState, null, AnyAction> => async (dispatch) => {
    dispatch({ type: SET_PIANO_READY, payload: { pianoReady } });
};