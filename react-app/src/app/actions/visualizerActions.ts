import { ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PAUSE_MIDI, PLAY_MIDI, SET_CURRENT_TRACK, VisualizerAction } from "./visualizerActionTypes";

export const setCurrentTrack = (track: number): ThunkAction<void, RootState, null, VisualizerAction> => async (dispatch) => {
    dispatch({ type: SET_CURRENT_TRACK, payload: track });
};

export const playMidi = (): ThunkAction<void, RootState, null, VisualizerAction> => async (dispatch) => {
    dispatch({ type: PLAY_MIDI });
  };
  
  export const pauseMidi = (): ThunkAction<void, RootState, null, VisualizerAction> => async (dispatch) => {
    dispatch({ type: PAUSE_MIDI });
  };
  